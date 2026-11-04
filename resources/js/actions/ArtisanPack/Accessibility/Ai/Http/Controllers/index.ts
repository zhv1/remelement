import ContentAccessibilityController from './ContentAccessibilityController'
import AriaSuggestionController from './AriaSuggestionController'
import ColorContrastExplanationController from './ColorContrastExplanationController'
const Controllers = {
    ContentAccessibilityController: Object.assign(ContentAccessibilityController, ContentAccessibilityController),
AriaSuggestionController: Object.assign(AriaSuggestionController, AriaSuggestionController),
ColorContrastExplanationController: Object.assign(ColorContrastExplanationController, ColorContrastExplanationController),
}

export default Controllers