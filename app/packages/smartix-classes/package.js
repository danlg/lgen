Package.describe({
  name: "smartix:classes",
  summary: "",
  version: "0.0.1",
  documentation:'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom("1.2");
    api.use('iron:router');
    api.use('tap:i18n');
    api.use('aldeed:collection2');
    api.use('aldeed:simple-schema');
    api.use('momentjs:moment');

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
    api.use('smartix:messages-addons-calendar');
    api.use('smartix:messages-addons-poll');
        
    api.addFiles('smartix-classes.js');
    api.addFiles('publications.js','server');
    api.addFiles('route.js');
    api.addFiles('schema.js')
    api.addFiles('methods.js','server');

    api.addFiles(['components/class_edit/class_edit.html',
                'components/class_edit/class_edit.js'],'client');
                
    api.addFiles(['components/class_information/class_information.html',
                'components/class_information/class_information.js'],'client');
                
    api.addFiles(['components/class_invitation/class_invitation.html',
                'components/class_invitation/class_invitation.css',
                'components/class_invitation/class_invitation.js'],'client');
                
    api.addFiles(['components/class_panel/class_panel.html',
                'components/class_panel/class_panel.css',
                'components/class_panel/class_panel.js'],'client');
                
    api.addFiles(['components/class_detail/class_detail.html',
                'components/class_detail/class_detail.css',
                'components/class_detail/class_detail.js'],'client');
                                    
    api.addFiles(['components/class_users/class_users.html',
                'components/class_users/class_users.js'],'client');                   

    api.addFiles(['components/join_class/join_class.html',
                'components/join_class/join_class.js',
                'components/join_class/join_class.scss']
                ,'client');  
                
    api.addFiles(['components/add_class/add_class.html',
                'components/add_class/add_class.js'],'client');  

    api.export('Smartix');
});