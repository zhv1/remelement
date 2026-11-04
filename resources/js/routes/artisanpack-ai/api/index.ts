import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
import settings from './settings'
import features from './features'
import usage from './usage'
/**
* @see \ArtisanPackUI\Ai\Http\Controllers\Api\TestConnectionController::__invoke
 * @see vendor/artisanpack-ui/ai/src/Http/Controllers/Api/TestConnectionController.php:44
 * @route '/api/artisanpack-ai/test-connection'
 */
export const testConnection = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testConnection.url(options),
    method: 'post',
})

testConnection.definition = {
    methods: ["post"],
    url: '/api/artisanpack-ai/test-connection',
} satisfies RouteDefinition<["post"]>

/**
* @see \ArtisanPackUI\Ai\Http\Controllers\Api\TestConnectionController::__invoke
 * @see vendor/artisanpack-ui/ai/src/Http/Controllers/Api/TestConnectionController.php:44
 * @route '/api/artisanpack-ai/test-connection'
 */
testConnection.url = (options?: RouteQueryOptions) => {
    return testConnection.definition.url + queryParams(options)
}

/**
* @see \ArtisanPackUI\Ai\Http\Controllers\Api\TestConnectionController::__invoke
 * @see vendor/artisanpack-ui/ai/src/Http/Controllers/Api/TestConnectionController.php:44
 * @route '/api/artisanpack-ai/test-connection'
 */
testConnection.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testConnection.url(options),
    method: 'post',
})
const api = {
    settings: Object.assign(settings, settings),
features: Object.assign(features, features),
usage: Object.assign(usage, usage),
testConnection: Object.assign(testConnection, testConnection),
}

export default api