Package.describe({
  name: "smartix:iconchooser",
  summary: "",
  version: "0.0.1",
  documentation:'README.md'
});

Npm.depends({
   cropperjs: "0.7.0",
//    async: "git+https://github.com/fengyuanchen/cropperjs.git"
});

Package.onUse(function(api) {
    api.versionsFrom("1.2");
    api.use('iron:router');
    api.use('templating', 'client');
    api.use('ecmascript');
    
    api.addFiles(['icon_choose/class_icon_choose/class_icon_choose.html',
                   'icon_choose/class_icon_choose/class_icon_choose.js'],'client');
                 
    api.addFiles(['icon_choose/you_icon_choose/you_icon_choose.html',
                   'icon_choose/you_icon_choose/you_icon_choose.js'],'client');
  
    api.addFiles(['icon_choose/you_icon_upload/you_icon_upload.html',
                  'icon_choose/you_icon_upload/cropper.css', 'icon_choose/you_icon_upload/you_icon_upload.js'],'client');
  
    api.addAssets(['icon_list/class_avatar.json',
                  'icon_list/profile_avatar.json'
                 ],'client');
    
    api.addFiles('helper.js','client');
    
});