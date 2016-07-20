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

Smartix.Utilities.removeEmptyProperties = function (object) {
    for (var prop in object) {
        if(typeof object[prop] === 'string') {
            object[prop] = object[prop].trim();
        }
        if (object[prop] === "" || object[prop] === null || object[prop] === undefined) {
            delete object[prop];
        }
    }
    return object;
}

Smartix.Utilities.removeEmptyObjectsFromArray = function (array) {
    return array.filter(function(obj) {
        return Object.keys(obj).length > 0;
    });
}

// Taken from http://stackoverflow.com/a/2970667
// Alternative to _.camelCase (if needed)
Smartix.Utilities.camelize = function (str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
}

Smartix.Utilities.stringToLetterCase = function (str) {
    // Replaces all non-alphanumeric characters with hyphen
    // Converts all to lowercase
    return str.replace(/\W+/g, '-').toLowerCase().replace(/^-+|-+$/g, "");
}

Smartix.Utilities.getMinutesSinceMidnight = function (timeString) {
    if(!timeString) {
        return null;
    }
    var mmt = moment(timeString, 'HH:mm');
    var mmtUnix = parseInt(mmt.unix());
    // Your moment at midnight
    var mmtMidnight = mmt.clone().startOf('day');
    var mmtMidnightUnix = parseInt(mmtMidnight.unix())
    // Difference in minutes
    var diffMinutes = mmtUnix - mmtMidnightUnix;
    if(isNaN(diffMinutes) || diffMinutes < 0) {
        return null;
    }
    return diffMinutes;
}
