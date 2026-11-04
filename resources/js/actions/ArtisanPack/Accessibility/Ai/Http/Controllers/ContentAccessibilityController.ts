import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../wayfinder'
/**
* @see \ArtisanPack\Accessibility\Ai\Http\Controllers\ContentAccessibilityController::__invoke
 * @see vendor/artisanpack-ui/accessibility/src/Ai/Http/Controllers/ContentAccessibilityController.php:39
 * @route '/api/v1/a11y/ai/content-analysis'
 */
const ContentAccessibilityController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ContentAccessibilityController.url(options),
    method: 'post',
})

ContentAccessibilityController.definition = {
    methods: ["post"],
    url: '/api/v1/a11y/ai/content-analysis',
} satisfies RouteDefinition<["post"]>

/**
* @see \ArtisanPack\Accessibility\Ai\Http\Controllers\ContentAccessibilityController::__invoke
 * @see vendor/artisanpack-ui/accessibility/src/Ai/Http/Controllers/ContentAccessibilityController.php:39
 * @route '/api/v1/a11y/ai/content-analysis'
 */
ContentAccessibilityController.url = (options?: RouteQueryOptions) => {
    return ContentAccessibilityController.definition.url + queryParams(options)
}

/**
* @see \ArtisanPack\Accessibility\Ai\Http\Controllers\ContentAccessibilityController::__invoke
 * @see vendor/artisanpack-ui/accessibility/src/Ai/Http/Controllers/ContentAccessibilityController.php:39
 * @route '/api/v1/a11y/ai/content-analysis'
 */
ContentAccessibilityController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ContentAccessibilityController.url(options),
    method: 'post',
})
export default ContentAccessibilityController