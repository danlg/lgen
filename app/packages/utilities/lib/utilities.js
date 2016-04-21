_ = lodash;

Smartix = Smartix || {};

Smartix.Utilities = Smartix.Utilities || {};

// Converts letter-case string to CapitalCase
Smartix.Utilities.letterCaseToCapitalCase = function (string) {
    var camelCased = _.camelCase(string);
    return camelCased.charAt(0).toUpperCase() + camelCased.slice(1);
}