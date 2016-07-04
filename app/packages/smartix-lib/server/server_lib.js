Smartix = Smartix || {};
Smartix.Lib = Smartix.Lib || {};
Smartix.Lib.Server = Smartix.Lib.Server || {};

/**
 * This library is just a server side library
 */

/**
 *
 * @param email
 * @returns {*|boolean}
 * @constructor
 */
Smartix.Lib.Server.IsGoogleAccount = function (email) {
	//TODO add DNS lookup with MX record to have Google app check
	//exists in node 6.2 API is it in node 0.10 ?
	var test = lodash.endsWith(email, '@gmail.com');
	log.info("Smartix.Lib.Server.IsGoogleAccount", test);
	return test;
};