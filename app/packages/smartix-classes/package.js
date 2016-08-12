Package.describe({
  name: "smartix:classes",
  summary: "",
  version: "0.0.1",
  documentation:'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom("1.3.1");
    api.use('ecmascript');
    api.use('iron:router');
    api.use('tap:i18n');
    api.use('aldeed:collection2');
    api.use('aldeed:simple-schema');
    api.use('momentjs:moment');
    api.use('aldeed:autoform');

    api.use('reactive-var','client');
    api.use('session', 'client');
    api.use('templating', 'client');
    api.use('fourseven:scss@2.0.0','client');    
    api.use('stevezhu:lodash@4.6.1');
    api.use('chrismbeckett:toastr');   
   
    api.use('smartix:core');
    api.use('smartix:accounts-utilities@0.0.1');
    api.use('smartix:accounts-schools');
    api.use('smartix:groups');
    api.use('smartix:distribution-lists');
    api.use('smartix:messages-addons-calendar');
    api.use('smartix:messages-addons-poll');
    api.use('smartix:accounts-relationships');
    api.use('smartix:email-template');
    
    
    api.addFiles('lib/schema.js', ['client', 'server']);
    api.addFiles('lib/route.js', ['client', 'server']);
    api.addFiles('lib/helpers.js', ['client', 'server']);
    api.addFiles('server/smartix-classes.js', ['server']);
    api.addFiles('server/methods.js', ['server']);
    api.addFiles('server/publications.js', ['server']);
    api.addFiles('client/schema.js', ['client']);
    api.addFiles('client/autoformHooks/addClass.js', ['client']);

    api.addFiles(['client/components/class_edit/class_edit.html',
                'client/components/class_edit/class_edit.js'],'client');
                
    api.addFiles(['client/components/class_information/class_information.html',
                'client/components/class_information/class_information.js'],'client');
                
    api.addFiles(['client/components/class_invitation/class_invitation.html',
                'client/components/class_invitation/class_invitation.css',
                'client/components/class_invitation/class_invitation.js'],'client');
                
    api.addFiles(['client/components/class_panel/class_panel.html',
                'client/components/class_panel/class_panel.css',
                'client/components/class_panel/class_panel.js'],'client');
                
    api.addFiles(['client/components/class_detail/class_detail.html',
                'client/components/class_detail/class_detail.css',
                'client/components/class_detail/class_detail.js'],'client');
                                    
    api.addFiles(['client/components/class_users/class_users.html',
                'client/components/class_users/class_users.js'],'client');                   

    api.addFiles(['client/components/join_class/join_class.html',
                'client/components/join_class/join_class.js',
                'client/components/join_class/join_class.scss']
                ,'client');  
                
    api.addFiles(['client/components/add_class/add_class.html',
                'client/components/add_class/add_class.js'],'client');  

    api.export('Smartix');
});