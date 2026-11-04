import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \ArtisanPackUI\Security\Http\Controllers\CspViolationController::report
 * @see vendor/artisanpack-ui/security/src/Http/Controllers/CspViolationController.php:33
 * @route '/csp-violation'
 */
export const report = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: report.url(options),
    method: 'post',
})

report.definition = {
    methods: ["post"],
    url: '/csp-violation',
} satisfies RouteDefinition<["post"]>

/**
* @see \ArtisanPackUI\Security\Http\Controllers\CspViolationController::report
 * @see vendor/artisanpack-ui/security/src/Http/Controllers/CspViolationController.php:33
 * @route '/csp-violation'
 */
report.url = (options?: RouteQueryOptions) => {
    return report.definition.url + queryParams(options)
}

/**
* @see \ArtisanPackUI\Security\Http\Controllers\CspViolationController::report
 * @see vendor/artisanpack-ui/security/src/Http/Controllers/CspViolationController.php:33
 * @route '/csp-violation'
 */
report.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: report.url(options),
    method: 'post',
})
const CspViolationController = { report }

export default CspViolationController