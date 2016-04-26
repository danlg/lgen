_ = lodash;

Smartix = Smartix || {};

Smartix.Utilities = Smartix.Utilities || {};

// Converts letter-case string to CapitalCase
Smartix.Utilities.letterCaseToCapitalCase = function (string) {
    var camelCased = _.camelCase(string);
    return camelCased.charAt(0).toUpperCase() + camelCased.slice(1);
}

Smartix.Utilities.getLanguageCode = function (lang) {
    check(lang, String);
    
    switch(lang) {
        case 'English':
        case 'english':
        case 'Eng':
        case 'eng':
        case 'en':
            return 'en';
        case 'French':
        case 'french':
        case 'fr':
            return 'fr';
        case 'Mandarin':
        case 'mandarin':
        case 'zh-cn':
            return 'zh-cn';
        case 'Chinese':
        case 'chinese':
        case 'Cantonese':
        case 'Traditional Chinese':
        case 'Taiwan':
        case 'zh-tw':
        default:
            return 'zh-tw';
    }
}