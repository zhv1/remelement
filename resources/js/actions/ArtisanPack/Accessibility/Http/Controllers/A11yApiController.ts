import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \ArtisanPack\Accessibility\Http\Controllers\A11yApiController::contrastCheck
 * @see vendor/artisanpack-ui/accessibility/src/Http/Controllers/A11yApiController.php:15
 * @route '/api/v1/a11y/contrast-check'
 */
export const contrastCheck = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: contrastCheck.url(options),
    method: 'post',
})

contrastCheck.definition = {
    methods: ["post"],
    url: '/api/v1/a11y/contrast-check',
} satisfies RouteDefinition<["post"]>

/**
* @see \ArtisanPack\Accessibility\Http\Controllers\A11yApiController::contrastCheck
 * @see vendor/artisanpack-ui/accessibility/src/Http/Controllers/A11yApiController.php:15
 * @route '/api/v1/a11y/contrast-check'
 */
contrastCheck.url = (options?: RouteQueryOptions) => {
    return contrastCheck.definition.url + queryParams(options)
}

/**
* @see \ArtisanPack\Accessibility\Http\Controllers\A11yApiController::contrastCheck
 * @see vendor/artisanpack-ui/accessibility/src/Http/Controllers/A11yApiController.php:15
 * @route '/api/v1/a11y/contrast-check'
 */
contrastCheck.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: contrastCheck.url(options),
    method: 'post',
})

/**
* @see \ArtisanPack\Accessibility\Http\Controllers\A11yApiController::generateTextColor
 * @see vendor/artisanpack-ui/accessibility/src/Http/Controllers/A11yApiController.php:25
 * @route '/api/v1/a11y/generate-text-color'
 */
export const generateTextColor = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateTextColor.url(options),
    method: 'post',
})

generateTextColor.definition = {
    methods: ["post"],
    url: '/api/v1/a11y/generate-text-color',
} satisfies RouteDefinition<["post"]>

/**
* @see \ArtisanPack\Accessibility\Http\Controllers\A11yApiController::generateTextColor
 * @see vendor/artisanpack-ui/accessibility/src/Http/Controllers/A11yApiController.php:25
 * @route '/api/v1/a11y/generate-text-color'
 */
generateTextColor.url = (options?: RouteQueryOptions) => {
    return generateTextColor.definition.url + queryParams(options)
}

/**
* @see \ArtisanPack\Accessibility\Http\Controllers\A11yApiController::generateTextColor
 * @see vendor/artisanpack-ui/accessibility/src/Http/Controllers/A11yApiController.php:25
 * @route '/api/v1/a11y/generate-text-color'
 */
generateTextColor.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateTextColor.url(options),
    method: 'post',
})

/**
* @see \ArtisanPack\Accessibility\Http\Controllers\A11yApiController::auditPalette
 * @see vendor/artisanpack-ui/accessibility/src/Http/Controllers/A11yApiController.php:34
 * @route '/api/v1/a11y/audit-palette'
 */
export const auditPalette = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: auditPalette.url(options),
    method: 'post',
})

auditPalette.definition = {
    methods: ["post"],
    url: '/api/v1/a11y/audit-palette',
} satisfies RouteDefinition<["post"]>

/**
* @see \ArtisanPack\Accessibility\Http\Controllers\A11yApiController::auditPalette
 * @see vendor/artisanpack-ui/accessibility/src/Http/Controllers/A11yApiController.php:34
 * @route '/api/v1/a11y/audit-palette'
 */
auditPalette.url = (options?: RouteQueryOptions) => {
    return auditPalette.definition.url + queryParams(options)
}

/**
* @see \ArtisanPack\Accessibility\Http\Controllers\A11yApiController::auditPalette
 * @see vendor/artisanpack-ui/accessibility/src/Http/Controllers/A11yApiController.php:34
 * @route '/api/v1/a11y/audit-palette'
 */
auditPalette.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: auditPalette.url(options),
    method: 'post',
})
const A11yApiController = { contrastCheck, generateTextColor, auditPalette }

export default A11yApiController