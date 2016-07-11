Package.describe({
  name: 'smartix:subscription',
  version: '0.0.1',
  summary: '',
  git: '',
});

Npm.depends({
  chargebee: '2.0.9'
});

Package.onUse(function (api) {
  api.versionsFrom('1.3.1');
  api.use('ecmascript');
  api.use('stevezhu:lodash@4.6.1');
  
  api.addFiles('server/api.js', 'server');

});