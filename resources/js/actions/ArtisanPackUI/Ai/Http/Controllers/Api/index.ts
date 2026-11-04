import SettingsController from './SettingsController'
import FeaturesController from './FeaturesController'
import UsageController from './UsageController'
import TestConnectionController from './TestConnectionController'
const Api = {
    SettingsController: Object.assign(SettingsController, SettingsController),
FeaturesController: Object.assign(FeaturesController, FeaturesController),
UsageController: Object.assign(UsageController, UsageController),
TestConnectionController: Object.assign(TestConnectionController, TestConnectionController),
}

export default Api