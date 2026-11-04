import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \ArtisanPackUI\Ai\Http\Controllers\Api\FeaturesController::index
 * @see vendor/artisanpack-ui/ai/src/Http/Controllers/Api/FeaturesController.php:40
 * @route '/api/artisanpack-ai/features'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/artisanpack-ai/features',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \ArtisanPackUI\Ai\Http\Controllers\Api\FeaturesController::index
 * @see vendor/artisanpack-ui/ai/src/Http/Controllers/Api/FeaturesController.php:40
 * @route '/api/artisanpack-ai/features'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \ArtisanPackUI\Ai\Http\Controllers\Api\FeaturesController::index
 * @see vendor/artisanpack-ui/ai/src/Http/Controllers/Api/FeaturesController.php:40
 * @route '/api/artisanpack-ai/features'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \ArtisanPackUI\Ai\Http\Controllers\Api\FeaturesController::index
 * @see vendor/artisanpack-ui/ai/src/Http/Controllers/Api/FeaturesController.php:40
 * @route '/api/artisanpack-ai/features'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \ArtisanPackUI\Ai\Http\Controllers\Api\FeaturesController::toggle
 * @see vendor/artisanpack-ui/ai/src/Http/Controllers/Api/FeaturesController.php:74
 * @route '/api/artisanpack-ai/features/{featureKey}/toggle'
 */
export const toggle = (args: { featureKey: string | number } | [featureKey: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

toggle.definition = {
    methods: ["post"],
    url: '/api/artisanpack-ai/features/{featureKey}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \ArtisanPackUI\Ai\Http\Controllers\Api\FeaturesController::toggle
 * @see vendor/artisanpack-ui/ai/src/Http/Controllers/Api/FeaturesController.php:74
 * @route '/api/artisanpack-ai/features/{featureKey}/toggle'
 */
toggle.url = (args: { featureKey: string | number } | [featureKey: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { featureKey: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    featureKey: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        featureKey: args.featureKey,
                }

    return toggle.definition.url
            .replace('{featureKey}', parsedArgs.featureKey.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \ArtisanPackUI\Ai\Http\Controllers\Api\FeaturesController::toggle
 * @see vendor/artisanpack-ui/ai/src/Http/Controllers/Api/FeaturesController.php:74
 * @route '/api/artisanpack-ai/features/{featureKey}/toggle'
 */
toggle.post = (args: { featureKey: string | number } | [featureKey: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})
const FeaturesController = { index, toggle }

export default FeaturesController