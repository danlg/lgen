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
	log.info("Using ROOT_URL="+ process.env.ROOT_URL);
	log.info("Using PORT="+ process.env.PORT);
	log.info("Using BIND_IP="+ process.env.BIND_IP);
	log.info("Using HTTP_FORWARDED_COUNT=" + process.env.HTTP_FORWARDED_COUNT);
	if (process.env.CDN_DOMAIN) { //keycdn or cloudflare or cloudfront
		WebAppInternals.setBundledJsCssPrefix(process.env.CDN_DOMAIN);
		log.info("Setting CDN_DOMAIN=", process.env.CDN_DOMAIN);
		//WebApp.rawConnectHandlers.use(function(req, res, next) {
	}
	else {
		log.warn("CDN_DOMAIN not set");
	}
	if (process.env.SET_HTTP_HEADER) {
		log.info("Setting SET_HTTP_HEADER");
		WebApp.connectHandlers.use(function(req, res, next) {
			//https://docs.meteor.com/packages/webapp.html
			//for CDN we need to set the Content-Length
			res.setHeader('Content-Length', '9999');
			// add allow origin
			res.setHeader('Access-Control-Allow-Origin', '*');

			//http://plugins.telerik.com/cordova/plugin/wkwebview

			// Traditionally JavaScript can't make requests across domain boundaries. UIWebView was able to do this because the file protocol is not a domain. Since WKWebView uses the http protocol, you'll need to add CORS headers to your server. More specifically you need this header:
			// 	Access-Control-Allow-Origin: *
			// And depending on your configuration you may also need these:
			// Access-Control-Allow-Headers: Accept, Origin, Content-Type
			// Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
			// It's probably easiest to add all of them, confirm your app works and gradually remove headers.

			// add headers
			res.setHeader('Access-Control-Allow-Methods', [
				'GET, POST, PUT, DELETE, OPTIONS'
			].join(', '));
			res.setHeader('Access-Control-Allow-Headers', [
				'Accept',
				'Content-Type',
				'Origin'
			].join(', '));
			log.info("GET ORIGINAL URL", req.originalUrl);
			return next();
		});
	}
	else {
		log.warn("HTTP Header not set");
	}

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
