import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Orders\Pages\EditOrder::__invoke
 * @see app/Filament/Resources/Orders/Pages/EditOrder.php:7
 * @route '/admin/orders/{record}/edit'
 */
const EditOrder = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditOrder.url(args, options),
    method: 'get',
})

EditOrder.definition = {
    methods: ["get","head"],
    url: '/admin/orders/{record}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Orders\Pages\EditOrder::__invoke
 * @see app/Filament/Resources/Orders/Pages/EditOrder.php:7
 * @route '/admin/orders/{record}/edit'
 */
EditOrder.url = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { record: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    record: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        record: args.record,
                }

    return EditOrder.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Filament\Resources\Orders\Pages\EditOrder::__invoke
 * @see app/Filament/Resources/Orders/Pages/EditOrder.php:7
 * @route '/admin/orders/{record}/edit'
 */
EditOrder.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditOrder.url(args, options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\Orders\Pages\EditOrder::__invoke
 * @see app/Filament/Resources/Orders/Pages/EditOrder.php:7
 * @route '/admin/orders/{record}/edit'
 */
EditOrder.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: EditOrder.url(args, options),
    method: 'head',
})
export default EditOrder