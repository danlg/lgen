Package.describe({
  name: "smartix:iconchooser",
  summary: "",
  version: "0.0.1",
  documentation:'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom("1.2");
    api.use('iron:router');
    api.use('templating', 'client');
    
    api.addFiles(['icon_choose/class_icon_choose/class_icon_choose.html',
                   'icon_choose/class_icon_choose/class_icon_choose.js'],'client');
                   
    api.addFiles(['icon_choose/you_icon_choose/you_icon_choose.html',
                   'icon_choose/you_icon_choose/you_icon_choose.js'],'client');
  
    api.addAssets(['icon_list/class_avatar.json',
                  'icon_list/profile_avatar.json'
                 ],'client');
    
    api.addFiles('helper.js','client');
    
});