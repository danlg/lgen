Package.describe({
  name: "smartix:calendarevent",
  summary: "",
  version: "0.0.1",
  documentation:'README.md'
});


Package.onUse(function(api) {
     api.versionsFrom("1.2");
     api.use('ecmascript');
     api.use('iron:router');
     api.use('momentjs:moment','client');
     api.use('jquery', 'client');
     api.use('reactive-var','client');
     api.use('session', 'client');
     api.use('templating', 'client');
     api.use('fullcalendar:fullcalendar', 'client');
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

     api.addFiles('routes.js');         
});