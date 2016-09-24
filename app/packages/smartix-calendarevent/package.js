Package.describe({
  name: "smartix:calendarevent",
  summary: "",
  version: "0.0.1",
  documentation:'README.md'
});

Npm.depends({
     'fullcalendar': "3.0.0"
});

Package.onUse(function(api) {
     api.versionsFrom("1.2");
     api.use('ecmascript');
     api.use('iron:router');
     api.use('momentjs:moment','client');
     api.use('reactive-var','client');
     api.use('session', 'client');
     api.use('templating', 'client');
     //api.use('jquery', 'client');
     //api.use('fullcalendar:fullcalendar', 'client');
     api.use('aldeed:collection2');
     api.use('aldeed:simple-schema');
     api.use('stevezhu:lodash@4.6.1');
     
     api.use('smartix:newsgroups');
     api.use('smartix:messages-addons-calendar');
     
     api.addFiles('calendar_event.html','client');
     api.addFiles('calendar_event.js','client');  

     api.addFiles('client/templates/view/calendar_display.html', 'client');
     api.addFiles('client/templates/view/calendar_display.js', 'client');  
          
     api.addFiles('client/templates/list/calendar_list_view.html', 'client');
     api.addFiles('client/templates/list/calendar_list_view.js', 'client');

     //fullcalendar integration,
     //Watch out we had to copy paste from Npm source, Need to manually synchronized if fullcalendar upgrade
     api.addFiles('client/templates/fullcalendar/fullcalendar.css', 'client');
     api.addFiles('client/templates/fullcalendar/locale-all.js', 'client');
     api.addFiles('client/templates/fullcalendar/gcal.js', 'client');
     api.addFiles('routes.js');         
});