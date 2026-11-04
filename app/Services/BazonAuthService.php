<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class BazonAuthService
{
    protected string $authBaseUrl;
    protected string $login;
    protected string $password;

    public function __construct()
    {
        $this->authBaseUrl = config('services.bazon.auth_url');
        $this->login = config('services.bazon.login');
        $this->password = config('services.bazon.password');
    }

    /**
     * Получить Access Token:
     * 1. Из кеша, если живой
     * 2. Через Refresh Token, если он есть
     * 3. Через полный логин
     */
    public function getAccessToken(): ?string
    {
        // 1. Если есть живой Access Token в кеше — возвращаем его
        $cached = Cache::get('bazon_access_token');
        if ($cached) {
            return $cached;
        }

        // 2. Если есть Refresh Token — пробуем обновить через него
        $refreshToken = Cache::get('bazon_refresh_token');
        if ($refreshToken) {
            $refreshed = $this->refreshTokens($refreshToken);
            if ($refreshed) {
                return $refreshed;
            }
        }

        // 3. Иначе — полный логин
        return $this->login();
    }

    /**
     * Полный логин по логину/паролю.
     * Используется только если нет валидного AT и RT.
     */
    protected function login(): ?string
    {
        $response = Http::post("{$this->authBaseUrl}/login/user", [
            'login' => $this->login,
            'password' => $this->password,
        ]);

        if ($response->failed()) {
            Log::error('Bazon login failed', ['body' => $response->body()]);
            return null;
        }

        $data = $response->json();

        if (empty($data['AT'])) {
            Log::error('Bazon login: no AT in response', ['body' => $response->body()]);
            return null;
        }

        // Кешируем AT на 14 минут (TTL из API = 900 сек, берем с запасом)
        Cache::put('bazon_access_token', $data['AT'], 840);

        // Кешируем RT на 30 дней
        if (!empty($data['RT'])) {
            Cache::put('bazon_refresh_token', $data['RT'], now()->addDays(30));
        }

        Log::info('Bazon: logged in successfully');

        return $data['AT'];
    }

    /**
     * Обновление токенов через Refresh Token.
     * Bazon принимает RT в заголовке Authorization и в теле запроса.
     */
    protected function refreshTokens(string $refreshToken): ?string
    {
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$refreshToken}",
        ])->post("{$this->authBaseUrl}/refresh/user", [
            'RT' => $refreshToken,
        ]);

        if ($response->failed()) {
            Log::warning('Bazon refresh failed, will try full login', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            // Refresh не сработал — удаляем старый RT, чтобы не пытаться снова
            Cache::forget('bazon_refresh_token');
            return null;
        }

        $data = $response->json();

        if (empty($data['AT'])) {
            Cache::forget('bazon_refresh_token');
            return null;
        }

        Cache::put('bazon_access_token', $data['AT'], 840);

        if (!empty($data['RT'])) {
            Cache::put('bazon_refresh_token', $data['RT'], now()->addDays(30));
        }

        Log::info('Bazon: token refreshed');

        return $data['AT'];
    }

    /**
     * Сброс токенов.
     * Вызывается при 401, чтобы BazonService мог запросить новый токен.
     */
    public function forgetTokens(): void
    {
        Cache::forget('bazon_access_token');
        Cache::forget('bazon_refresh_token');
    }

    /**
     * Явный отзыв токенов на стороне Bazon.
     * Не обязательно, но полезно при деинсталляции приложения.
     */
    public function revokeTokens(): bool
    {
        $refreshToken = Cache::get('bazon_refresh_token');
        if (!$refreshToken) {
            return false;
        }

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$refreshToken}",
        ])->post("{$this->authBaseUrl}/revoke/user", [
            'RT' => $refreshToken,
        ]);

        // В любом случае удаляем токены из кеша
        $this->forgetTokens();

        if ($response->failed()) {
            Log::warning('Bazon revoke failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            return false;
        }

        Log::info('Bazon: tokens revoked');
        return true;
    }
}