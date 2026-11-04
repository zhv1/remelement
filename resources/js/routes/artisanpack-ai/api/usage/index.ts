import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \ArtisanPackUI\Ai\Http\Controllers\Api\UsageController::index
 * @see vendor/artisanpack-ui/ai/src/Http/Controllers/Api/UsageController.php:52
 * @route '/api/artisanpack-ai/usage'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/artisanpack-ai/usage',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \ArtisanPackUI\Ai\Http\Controllers\Api\UsageController::index
 * @see vendor/artisanpack-ui/ai/src/Http/Controllers/Api/UsageController.php:52
 * @route '/api/artisanpack-ai/usage'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \ArtisanPackUI\Ai\Http\Controllers\Api\UsageController::index
 * @see vendor/artisanpack-ui/ai/src/Http/Controllers/Api/UsageController.php:52
 * @route '/api/artisanpack-ai/usage'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \ArtisanPackUI\Ai\Http\Controllers\Api\UsageController::index
 * @see vendor/artisanpack-ui/ai/src/Http/Controllers/Api/UsageController.php:52
 * @route '/api/artisanpack-ai/usage'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const usage = {
    index: Object.assign(index, index),
}

export default usage