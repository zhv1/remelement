import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Orders\Pages\ListOrders::__invoke
 * @see app/Filament/Resources/Orders/Pages/ListOrders.php:7
 * @route '/admin/orders'
 */
const ListOrders = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListOrders.url(options),
    method: 'get',
})

ListOrders.definition = {
    methods: ["get","head"],
    url: '/admin/orders',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Orders\Pages\ListOrders::__invoke
 * @see app/Filament/Resources/Orders/Pages/ListOrders.php:7
 * @route '/admin/orders'
 */
ListOrders.url = (options?: RouteQueryOptions) => {
    return ListOrders.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Orders\Pages\ListOrders::__invoke
 * @see app/Filament/Resources/Orders/Pages/ListOrders.php:7
 * @route '/admin/orders'
 */
ListOrders.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListOrders.url(options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\Orders\Pages\ListOrders::__invoke
 * @see app/Filament/Resources/Orders/Pages/ListOrders.php:7
 * @route '/admin/orders'
 */
ListOrders.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ListOrders.url(options),
    method: 'head',
})
export default ListOrders