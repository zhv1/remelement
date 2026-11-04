<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BazonService
{
    protected string $baseUrl;
    protected BazonAuthService $authService;

    public function __construct(BazonAuthService $authService)
    {
        $this->baseUrl = config('services.bazon.api_url');
        $this->authService = $authService;
    }

    /**
     * JSON-RPC запрос к Bazon
     *
     * @param string $method  Имя метода API (getProductsWithChars, getCarsrcs и т.д.)
     * @param array  $params  Параметры метода
     * @return array          Развёрнутый результат (response[0].result)
     */
    protected function request(string $method, array $params = []): array
    {
        $token = $this->authService->getAccessToken();
        if (!$token) {
            throw new \Exception('Не удалось получить токен Bazon');
        }

        $payload = [
            'request' => [
                [
                    'method' => $method,
                    'params' => $params,
                ],
            ],
        ];

        $response = Http::withToken($token)
            ->timeout(60)
            ->post($this->baseUrl, $payload);

        // Если 401 — токен истёк, сбрасываем кеш и пробуем ещё раз
        if ($response->status() === 401) {
            Log::info('Bazon API: 401, refreshing token');
            $this->authService->forgetTokens();

            $token = $this->authService->getAccessToken();
            if (!$token) {
                throw new \Exception('Не удалось обновить токен Bazon после 401');
            }

            $response = Http::withToken($token)
                ->timeout(60)
                ->post($this->baseUrl, $payload);
        }

        if ($response->failed()) {
            Log::error('Bazon API error', [
                'method' => $method,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new \Exception("Ошибка API Bazon: {$response->status()}");
        }

        $data = $response->json();

        // Разворачиваем JSON-RPC ответ: response[0].result
        if (isset($data['response'][0]['result'])) {
            $result = $data['response'][0]['result'];

            // Если внутри result есть error — выбрасываем исключение
            if (isset($result['error'])) {
                Log::error('Bazon API method error', [
                    'method' => $method,
                    'error' => $result['error'],
                ]);
                throw new \Exception("Ошибка метода Bazon {$method}: {$result['error']}");
            }

            return $result;
        }

        // Если response нет — возвращаем как есть (для отладки)
        return $data;
    }

    /**
     * Получить товары с развёрнутыми характеристиками
     */
    public function getProductsWithChars(int $offset = 0, int $limit = 500): array
    {
        $params = ['order' => 'asc', 'limit' => $limit];
        // Bazon не принимает offset = 0
        if ($offset > 0) {
            $params['offset'] = $offset;
        }
        return $this->request('getProductsWithChars', $params);
    }

    /**
     * Получить автомобили-доноры
     */
    public function getCarsrcs(int $offset = 0, int $limit = 500): array
    {
        $params = ['order' => 'asc', 'limit' => $limit];
        if ($offset > 0) {
            $params['offset'] = $offset;
        }
        return $this->request('getCarsrcs', $params);
    }

    /**
     * Получить документы сделок
     */
    public function getSaleDocuments(int $offset = 0, int $limit = 500): array
    {
        $params = ['order' => 'desc', 'limit' => $limit];
        if ($offset > 0) {
            $params['offset'] = $offset;
        }
        return $this->request('getSaleDocuments', $params);
    }

    /**
     * Получить склады
     */
    public function getStorages(): array
    {
        return $this->request('getStorages', []);
    }

    /**
     * Получить контрагентов
     */
    public function getContractors(int $offset = 0, int $limit = 500): array
    {
        $params = ['order' => 'asc', 'limit' => $limit];
        if ($offset > 0) {
            $params['offset'] = $offset;
        }
        return $this->request('getContractors', $params);
    }

    /**
     * Получить менеджеров
     */
    public function getManagers(int $offset = 0, int $limit = 500): array
    {
        $params = ['order' => 'asc', 'limit' => $limit];
        if ($offset > 0) {
            $params['offset'] = $offset;
        }
        return $this->request('getManagers', $params);
    }
}