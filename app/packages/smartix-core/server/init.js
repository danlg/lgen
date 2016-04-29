/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */

import log4js from 'log4js';

//var log4js = Meteor.npmRequire('log4js');
//console log is loaded by default, so you won't normally need to do this
  log4js.replaceConsole();
  log4js.loadAppender('file');

  log4js.configure({
    appenders: [
      { type: 'console' },
      { type: 'file' //file logger is async, which is good
        //https://github.com/nomiddlename/log4js-node/blob/master/lib/appenders/file.js
        , filename: 'genius-server.log'
        , category: 'lg' }
    ]
  });
log = log4js.getLogger('lg');//global variable

Meteor.startup(function () {
  Push.debug = true;
  //SimpleSchema.debug = true;




  log.setLevel('INFO');

  log.info("Using env DDP_DEFAULT_CONNECTION_URL="+ Meteor.settings.DDP_DEFAULT_CONNECTION_URL);
  log.info("Using meteor DDP_DEFAULT_CONNECTION_URL="+ __meteor_runtime_config__.DDP_DEFAULT_CONNECTION_URL);

  Accounts.config({
    //we keep delay at 90 days
    //loginExpirationInDays: null
  });

  if (Meteor.settings && Meteor.settings.GOOGLE_CLIENT_ID && Meteor.settings.GOOGLE_SECRET)
  {
    log.info("Setting up Google with Meteor.settings.GOOGLE_CLIENT_ID "+ Meteor.settings.GOOGLE_CLIENT_ID);
    ServiceConfiguration.configurations.upsert(
      { service: "google" },
      {
        $set: {
          //clientId: "122417300165-4i555ct1kvrf8fesec9bp1f9vprdrlef.apps.googleusercontent.com",
          //secret: "jyI4QhG3lz2J_fXxSk1QXxJG",
          clientId: Meteor.settings.GOOGLE_CLIENT_ID,
          secret:   Meteor.settings.GOOGLE_SECRET
        }
      });
  }
  else
  {
    log.error("Unknown Meteor.settings.GOOGLE_CLIENT_ID");
  }

  //only user with admin key and the value set as true can view the facts in perf page
  Facts.setUserIdFilter(function (userId) {
    var user = Meteor.users.findOne(userId);
    return user && user.admin;
  });
  
});
