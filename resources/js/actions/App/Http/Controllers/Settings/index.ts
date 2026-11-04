import ProfileController from './ProfileController'
import PasswordController from './PasswordController'
import AppearanceController from './AppearanceController'
const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
PasswordController: Object.assign(PasswordController, PasswordController),
AppearanceController: Object.assign(AppearanceController, AppearanceController),
}

export default Settings