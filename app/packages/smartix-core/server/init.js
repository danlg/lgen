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
      { type: 'console'
        //, pattern: '%d{dd MMM yyyy HH:mm:ss]} %m%n'
        , pattern: '%d{dd MMM yyyy HH:mm:ss} %m%n'
        },
      { type: 'file' //file logger is async, which is good
        , pattern: '%d{dd MMM yyyy HH:mm:ss} %m%n'
        //, pattern: '[%[%r]] %p %m%n'
        , filename: 'littlegenius.log'
        , category: 'lg' }
    ]
  });
log = log4js.getLogger('lg');//global variable

Meteor.startup(function () {
  Push.debug = true;
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
