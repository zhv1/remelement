import CatalogController from './CatalogController'
import OrderController from './OrderController'
import Auth from './Auth'
import Settings from './Settings'
const Controllers = {
    CatalogController: Object.assign(CatalogController, CatalogController),
OrderController: Object.assign(OrderController, OrderController),
Auth: Object.assign(Auth, Auth),
Settings: Object.assign(Settings, Settings),
}

export default Controllers