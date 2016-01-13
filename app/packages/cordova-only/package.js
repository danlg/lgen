Package.describe({
  name: "cordova-only",
  summary: "Add dependencies and styling for Cordova app.",
  version: "0.0.1"
});

Package.onUse(function (api) {
  api.versionsFrom("METEOR@1.0");
 
  // Add emojione-awesome to point to public folder
  api.addFiles(['emojione-awesome-cordova.css'], ['web.cordova']);

});
