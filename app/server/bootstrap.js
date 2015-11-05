Meteor.startup(function () {


  Push.debug = true;
  log = loglevel.createLogger('lg');
  log.info("log initialized");
  log.setLevel("info");

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

});
