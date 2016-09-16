/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */

import log4js from 'log4js';

//var log4js = Meteor.npmRequire('log4js');
//console log is loaded by default, so you won't normally need to do this
log4js.replaceConsole();
log4js.loadAppender('file');

// see https://github.com/nomiddlename/log4js-node/wiki/Layouts
// and also //https://github.com/nomiddlename/log4js-node/blob/master/lib/appenders/file.js
log4js.configure({
	appenders: [
		{
			type: 'console'
			//, pattern: '%d{dd MMM yyyy HH:mm:ss]} %m%n'
			, pattern: '%d{dd MMM yyyy HH:mm:ss} %m%n'
		},
		{
			type: 'file' //file logger is async, which is good
			, pattern: '%d{dd MMM yyyy HH:mm:ss} %m%n'
			//, pattern: '[%[%r]] %p %m%n'
			, filename: 'littlegenius.log'
			, category: 'lg'
		}
	]
});
log = log4js.getLogger('lg');//global variable

Meteor.startup(function () {
	log.setLevel('INFO');
	log.info("======================================================================");
	log.info("====================== STARTING SMARTIX ==============================");
	log.info("======================================================================");
	//Push.debug = true;
	//Push.Configure();
	if (process.env.CDN_DOMAIN) { //keycdn or cloudflare or cloudfront
		WebAppInternals.setBundledJsCssPrefix(process.env.CDN_DOMAIN);
		log.info("Setting CDN_DOMAIN=", process.env.CDN_DOMAIN);
		//https://docs.meteor.com/packages/webapp.html
		//for CDN we need to set the Content-Length
		//WebApp.rawConnectHandlers.use(function(req, res, next) {

	}
	else {
		log.warn("Setting CDN_DOMAIN not set");
	}

	// WebApp.rawConnectHandlers.use(function (req, res, next) {
	// 	//WebApp.connectHandlers.use( function(req, res, next) {
	// 	//https://github.com/meteor/meteor/blob/devel/packages/webapp/webapp_server.js
	// 	res.setHeader("Content-Length", 777); //res.setHeader("X-Clacks-Overhead", "GNU Terry Pratchett");
	// 	res.end();
	// 	log.info("GET ORIGINAL URL", req.originalUrl);
	// 	return next();
	// });

	log.info("Using DDP_DEFAULT_CONNECTION_URL=", Meteor.settings.DDP_DEFAULT_CONNECTION_URL);
	log.info("Using DDP_DEFAULT_CONNECTION_URL=", __meteor_runtime_config__.DDP_DEFAULT_CONNECTION_URL);

	Accounts.config({
		//we keep delay at 90 days
		//loginExpirationInDays: null
	});

	if (Meteor.settings && Meteor.settings.GOOGLE_CLIENT_ID && Meteor.settings.GOOGLE_SECRET) {
		log.info("Setting up Google with Meteor.settings.GOOGLE_CLIENT_ID " + Meteor.settings.GOOGLE_CLIENT_ID);
		ServiceConfiguration.configurations.upsert(
			{service: "google"},
			{
				$set: {
					clientId: Meteor.settings.GOOGLE_CLIENT_ID,
					secret: Meteor.settings.GOOGLE_SECRET
				}
			});
	}
	else {
		log.error("Unknown Meteor.settings.GOOGLE_CLIENT_ID");
	}

	//only user with admin key and the value set as true can view the facts in perf page
	Facts.setUserIdFilter(function (userId) {
		var user = Meteor.users.findOne(userId);
		return user && user.admin;
	});

});
