Package.describe({
  name: "smartix:sharer",
  summary: "share class by a public link via email or copy to clipboard or other mobile app.",
  version: "0.0.1",
  documentation:'README.md'
});

Package.onUse(function(api) {
     api.versionsFrom("1.2");
     api.use('iron:router');
     api.use('tap:i18n');
     api.use('aldeed:collection2');
     api.use('aldeed:simple-schema');
     api.use('reactive-var','client');
     api.use('session', 'client');
     api.use('templating', 'client');
     api.use('smartix:classes');
     
     api.addFiles('route.js');
     
     api.addFiles(['components/email_invite/email_invite.html',
                   'components/email_invite/email_invite.js',
                   'components/email_invite/email_invite.css'
                   ],'client');

     api.addFiles(['components/share_invite/share_invite.html',
                   'components/share_invite/share_invite.js',
                   'components/share_invite/share_invite.css'
                   ],'client');
                   
     api.addFiles(['components/share_link_class_info/class_info_for_web_user/class_info_for_web_user.html',
                   'components/share_link_class_info/class_info_for_web_user/class_info_for_web_user.js',
                   ],'client');
                   
     api.addFiles(['components/share_link_class_info/class_search_info_for_web_user/class_search_info_for_web_user.html',
                   'components/share_link_class_info/class_search_info_for_web_user/class_search_info_for_web_user.js',
                   ],'client');                                     
                                                        
});