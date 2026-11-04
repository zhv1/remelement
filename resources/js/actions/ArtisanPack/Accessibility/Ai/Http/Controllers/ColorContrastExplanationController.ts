import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../wayfinder'
/**
* @see \ArtisanPack\Accessibility\Ai\Http\Controllers\ColorContrastExplanationController::__invoke
 * @see vendor/artisanpack-ui/accessibility/src/Ai/Http/Controllers/ColorContrastExplanationController.php:36
 * @route '/api/v1/a11y/ai/contrast-explanation'
 */
const ColorContrastExplanationController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ColorContrastExplanationController.url(options),
    method: 'post',
})

ColorContrastExplanationController.definition = {
    methods: ["post"],
    url: '/api/v1/a11y/ai/contrast-explanation',
} satisfies RouteDefinition<["post"]>

/**
* @see \ArtisanPack\Accessibility\Ai\Http\Controllers\ColorContrastExplanationController::__invoke
 * @see vendor/artisanpack-ui/accessibility/src/Ai/Http/Controllers/ColorContrastExplanationController.php:36
 * @route '/api/v1/a11y/ai/contrast-explanation'
 */
ColorContrastExplanationController.url = (options?: RouteQueryOptions) => {
    return ColorContrastExplanationController.definition.url + queryParams(options)
}

/**
* @see \ArtisanPack\Accessibility\Ai\Http\Controllers\ColorContrastExplanationController::__invoke
 * @see vendor/artisanpack-ui/accessibility/src/Ai/Http/Controllers/ColorContrastExplanationController.php:36
 * @route '/api/v1/a11y/ai/contrast-explanation'
 */
ColorContrastExplanationController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ColorContrastExplanationController.url(options),
    method: 'post',
})
export default ColorContrastExplanationController