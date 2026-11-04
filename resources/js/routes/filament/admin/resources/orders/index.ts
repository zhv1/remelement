import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Orders\Pages\ListOrders::__invoke
 * @see app/Filament/Resources/Orders/Pages/ListOrders.php:7
 * @route '/admin/orders'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/orders',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Orders\Pages\ListOrders::__invoke
 * @see app/Filament/Resources/Orders/Pages/ListOrders.php:7
 * @route '/admin/orders'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Orders\Pages\ListOrders::__invoke
 * @see app/Filament/Resources/Orders/Pages/ListOrders.php:7
 * @route '/admin/orders'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\Orders\Pages\ListOrders::__invoke
 * @see app/Filament/Resources/Orders/Pages/ListOrders.php:7
 * @route '/admin/orders'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Orders\Pages\EditOrder::__invoke
 * @see app/Filament/Resources/Orders/Pages/EditOrder.php:7
 * @route '/admin/orders/{record}/edit'
 */
export const edit = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/orders/{record}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Orders\Pages\EditOrder::__invoke
 * @see app/Filament/Resources/Orders/Pages/EditOrder.php:7
 * @route '/admin/orders/{record}/edit'
 */
edit.url = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Filament\Resources\Orders\Pages\EditOrder::__invoke
 * @see app/Filament/Resources/Orders/Pages/EditOrder.php:7
 * @route '/admin/orders/{record}/edit'
 */
edit.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\Orders\Pages\EditOrder::__invoke
 * @see app/Filament/Resources/Orders/Pages/EditOrder.php:7
 * @route '/admin/orders/{record}/edit'
 */
edit.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})
const orders = {
    index: Object.assign(index, index),
edit: Object.assign(edit, edit),
}

export default orders