import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \ArtisanPack\Accessibility\Ai\Http\Controllers\ContentAccessibilityController::__invoke
 * @see vendor/artisanpack-ui/accessibility/src/Ai/Http/Controllers/ContentAccessibilityController.php:39
 * @route '/api/v1/a11y/ai/content-analysis'
 */
export const contentAnalysis = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: contentAnalysis.url(options),
    method: 'post',
})

contentAnalysis.definition = {
    methods: ["post"],
    url: '/api/v1/a11y/ai/content-analysis',
} satisfies RouteDefinition<["post"]>

/**
* @see \ArtisanPack\Accessibility\Ai\Http\Controllers\ContentAccessibilityController::__invoke
 * @see vendor/artisanpack-ui/accessibility/src/Ai/Http/Controllers/ContentAccessibilityController.php:39
 * @route '/api/v1/a11y/ai/content-analysis'
 */
contentAnalysis.url = (options?: RouteQueryOptions) => {
    return contentAnalysis.definition.url + queryParams(options)
}

/**
* @see \ArtisanPack\Accessibility\Ai\Http\Controllers\ContentAccessibilityController::__invoke
 * @see vendor/artisanpack-ui/accessibility/src/Ai/Http/Controllers/ContentAccessibilityController.php:39
 * @route '/api/v1/a11y/ai/content-analysis'
 */
contentAnalysis.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: contentAnalysis.url(options),
    method: 'post',
})

/**
* @see \ArtisanPack\Accessibility\Ai\Http\Controllers\AriaSuggestionController::__invoke
 * @see vendor/artisanpack-ui/accessibility/src/Ai/Http/Controllers/AriaSuggestionController.php:36
 * @route '/api/v1/a11y/ai/aria-suggestion'
 */
export const ariaSuggestion = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ariaSuggestion.url(options),
    method: 'post',
})

ariaSuggestion.definition = {
    methods: ["post"],
    url: '/api/v1/a11y/ai/aria-suggestion',
} satisfies RouteDefinition<["post"]>

/**
* @see \ArtisanPack\Accessibility\Ai\Http\Controllers\AriaSuggestionController::__invoke
 * @see vendor/artisanpack-ui/accessibility/src/Ai/Http/Controllers/AriaSuggestionController.php:36
 * @route '/api/v1/a11y/ai/aria-suggestion'
 */
ariaSuggestion.url = (options?: RouteQueryOptions) => {
    return ariaSuggestion.definition.url + queryParams(options)
}

/**
* @see \ArtisanPack\Accessibility\Ai\Http\Controllers\AriaSuggestionController::__invoke
 * @see vendor/artisanpack-ui/accessibility/src/Ai/Http/Controllers/AriaSuggestionController.php:36
 * @route '/api/v1/a11y/ai/aria-suggestion'
 */
ariaSuggestion.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ariaSuggestion.url(options),
    method: 'post',
})

/**
* @see \ArtisanPack\Accessibility\Ai\Http\Controllers\ColorContrastExplanationController::__invoke
 * @see vendor/artisanpack-ui/accessibility/src/Ai/Http/Controllers/ColorContrastExplanationController.php:36
 * @route '/api/v1/a11y/ai/contrast-explanation'
 */
export const contrastExplanation = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: contrastExplanation.url(options),
    method: 'post',
})

contrastExplanation.definition = {
    methods: ["post"],
    url: '/api/v1/a11y/ai/contrast-explanation',
} satisfies RouteDefinition<["post"]>

/**
* @see \ArtisanPack\Accessibility\Ai\Http\Controllers\ColorContrastExplanationController::__invoke
 * @see vendor/artisanpack-ui/accessibility/src/Ai/Http/Controllers/ColorContrastExplanationController.php:36
 * @route '/api/v1/a11y/ai/contrast-explanation'
 */
contrastExplanation.url = (options?: RouteQueryOptions) => {
    return contrastExplanation.definition.url + queryParams(options)
}

/**
* @see \ArtisanPack\Accessibility\Ai\Http\Controllers\ColorContrastExplanationController::__invoke
 * @see vendor/artisanpack-ui/accessibility/src/Ai/Http/Controllers/ColorContrastExplanationController.php:36
 * @route '/api/v1/a11y/ai/contrast-explanation'
 */
contrastExplanation.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: contrastExplanation.url(options),
    method: 'post',
})
const ai = {
    contentAnalysis: Object.assign(contentAnalysis, contentAnalysis),
ariaSuggestion: Object.assign(ariaSuggestion, ariaSuggestion),
contrastExplanation: Object.assign(contrastExplanation, contrastExplanation),
}

export default ai