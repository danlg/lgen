Package.describe({
  name: "smartix:tour",
  summary: "",
  version: "0.0.1",
  documentation:'README.md'
});

Package.onUse(function(api) {
     api.versionsFrom("1.2");
     api.use('iron:router');
     api.use('tap:i18n');
     api.use('reactive-var','client');
     api.use('session', 'client');
     api.use('templating', 'client');
     api.use('fourseven:scss@2.0.0','client');    
     api.addFiles('route.js');
     
     api.addFiles(['components/app_tour/app_tour.html',
                   'components/app_tour/app_tour.css',
                   'components/app_tour/app_tour.js',
                   'components/app_tour/app_tour_image.css'
                   ],'client');
                   
     api.addFiles(['components/howto_invite/howto_invite.html',
                   'components/howto_invite/howto_invite.js',
                   'components/howto_invite/howto_invite.css',
                   'components/howto_invite/howto_invite_short.html',
                   'components/howto_invite/howto_invite_short.js'
                   ],'client');
     

                                           
});