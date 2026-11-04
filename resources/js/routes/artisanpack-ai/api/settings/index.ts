import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \ArtisanPackUI\Ai\Http\Controllers\Api\SettingsController::show
 * @see vendor/artisanpack-ui/ai/src/Http/Controllers/Api/SettingsController.php:49
 * @route '/api/artisanpack-ai/settings'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/artisanpack-ai/settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \ArtisanPackUI\Ai\Http\Controllers\Api\SettingsController::show
 * @see vendor/artisanpack-ui/ai/src/Http/Controllers/Api/SettingsController.php:49
 * @route '/api/artisanpack-ai/settings'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \ArtisanPackUI\Ai\Http\Controllers\Api\SettingsController::show
 * @see vendor/artisanpack-ui/ai/src/Http/Controllers/Api/SettingsController.php:49
 * @route '/api/artisanpack-ai/settings'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \ArtisanPackUI\Ai\Http\Controllers\Api\SettingsController::show
 * @see vendor/artisanpack-ui/ai/src/Http/Controllers/Api/SettingsController.php:49
 * @route '/api/artisanpack-ai/settings'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
* @see \ArtisanPackUI\Ai\Http\Controllers\Api\SettingsController::update
 * @see vendor/artisanpack-ui/ai/src/Http/Controllers/Api/SettingsController.php:91
 * @route '/api/artisanpack-ai/settings'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/artisanpack-ai/settings',
} satisfies RouteDefinition<["put"]>

/**
* @see \ArtisanPackUI\Ai\Http\Controllers\Api\SettingsController::update
 * @see vendor/artisanpack-ui/ai/src/Http/Controllers/Api/SettingsController.php:91
 * @route '/api/artisanpack-ai/settings'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \ArtisanPackUI\Ai\Http\Controllers\Api\SettingsController::update
 * @see vendor/artisanpack-ui/ai/src/Http/Controllers/Api/SettingsController.php:91
 * @route '/api/artisanpack-ai/settings'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})
const settings = {
    show: Object.assign(show, show),
update: Object.assign(update, update),
}

export default settings