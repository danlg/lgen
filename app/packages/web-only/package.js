Package.describe({
  name: "web-only",
  summary: "Add dependencies and styling for Web app.",
  version: "0.0.1"
});

Package.onUse(function (api) {
  api.versionsFrom("METEOR@1.0");
 
  api.addFiles(['emojione-awesome-web.css'], ['web.browser']);

});
