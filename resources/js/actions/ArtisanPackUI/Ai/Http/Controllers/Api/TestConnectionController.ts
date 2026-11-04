import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../wayfinder'
/**
* @see \ArtisanPackUI\Ai\Http\Controllers\Api\TestConnectionController::__invoke
 * @see vendor/artisanpack-ui/ai/src/Http/Controllers/Api/TestConnectionController.php:44
 * @route '/api/artisanpack-ai/test-connection'
 */
const TestConnectionController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: TestConnectionController.url(options),
    method: 'post',
})

TestConnectionController.definition = {
    methods: ["post"],
    url: '/api/artisanpack-ai/test-connection',
} satisfies RouteDefinition<["post"]>

/**
* @see \ArtisanPackUI\Ai\Http\Controllers\Api\TestConnectionController::__invoke
 * @see vendor/artisanpack-ui/ai/src/Http/Controllers/Api/TestConnectionController.php:44
 * @route '/api/artisanpack-ai/test-connection'
 */
TestConnectionController.url = (options?: RouteQueryOptions) => {
    return TestConnectionController.definition.url + queryParams(options)
}

/**
* @see \ArtisanPackUI\Ai\Http\Controllers\Api\TestConnectionController::__invoke
 * @see vendor/artisanpack-ui/ai/src/Http/Controllers/Api/TestConnectionController.php:44
 * @route '/api/artisanpack-ai/test-connection'
 */
TestConnectionController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: TestConnectionController.url(options),
    method: 'post',
})
export default TestConnectionController