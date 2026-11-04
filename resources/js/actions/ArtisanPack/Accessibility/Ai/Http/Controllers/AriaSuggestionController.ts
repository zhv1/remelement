import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../wayfinder'
/**
* @see \ArtisanPack\Accessibility\Ai\Http\Controllers\AriaSuggestionController::__invoke
 * @see vendor/artisanpack-ui/accessibility/src/Ai/Http/Controllers/AriaSuggestionController.php:36
 * @route '/api/v1/a11y/ai/aria-suggestion'
 */
const AriaSuggestionController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: AriaSuggestionController.url(options),
    method: 'post',
})

AriaSuggestionController.definition = {
    methods: ["post"],
    url: '/api/v1/a11y/ai/aria-suggestion',
} satisfies RouteDefinition<["post"]>

/**
* @see \ArtisanPack\Accessibility\Ai\Http\Controllers\AriaSuggestionController::__invoke
 * @see vendor/artisanpack-ui/accessibility/src/Ai/Http/Controllers/AriaSuggestionController.php:36
 * @route '/api/v1/a11y/ai/aria-suggestion'
 */
AriaSuggestionController.url = (options?: RouteQueryOptions) => {
    return AriaSuggestionController.definition.url + queryParams(options)
}

/**
* @see \ArtisanPack\Accessibility\Ai\Http\Controllers\AriaSuggestionController::__invoke
 * @see vendor/artisanpack-ui/accessibility/src/Ai/Http/Controllers/AriaSuggestionController.php:36
 * @route '/api/v1/a11y/ai/aria-suggestion'
 */
AriaSuggestionController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: AriaSuggestionController.url(options),
    method: 'post',
})
export default AriaSuggestionController