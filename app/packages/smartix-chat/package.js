Package.describe({
  name: "smartix:chat",
  summary: "",
  version: "0.0.1",
  documentation:'README.md'
});

Package.onUse(function(api) {
     api.versionsFrom("1.2");
     api.use('check');
     api.use('ecmascript');
     api.use('iron:router');
     api.use('tap:i18n');
     api.use('aldeed:collection2');
     api.use('aldeed:simple-schema');
     api.use('reywood:publish-composite');
     api.use('reactive-var','client');
     api.use('session', 'client');
     api.use('templating', 'client');
     api.use('fourseven:scss@2.0.0','client');
     api.use('alanning:roles','client');
     api.use('smartix:core');
     api.use('smartix:lib');
     api.use('smartix:accounts-schools');      
     api.use('smartix:classes');    
     api.use('smartix:notifications');
     api.use('smartix:accounts@0.0.1');
     api.use('smartix:accounts-system@0.0.1');
     api.use('smartix:accounts-schools@0.0.1');
     api.use('smartix:accounts-utilities@0.0.1');
     
     api.addFiles('publications.js','server');
     //api.addFiles('chat.js');
     api.addFiles('smartix-chat.js');
     api.addFiles('route.js');
     api.addFiles('schema.js')
     api.addFiles('methods.js','server');
     api.addFiles('methods_cs.js');
          
     api.addFiles(['components/chat_invite/chat_invite.html',
                   'components/chat_invite/chat_invite.js'],'client');

     api.addFiles(['components/chat_invite/group_chat_invite/group_chat_invite.html',
                   'components/chat_invite/group_chat_invite/group_chat_invite.js',
                   'components/chat_invite/group_chat_invite/group_chat_invite_joined_class_list.html',
                   'components/chat_invite/group_chat_invite/group_chat_invite_joined_class_list.js',
                   ]
                   ,'client');
                   
                                     
     api.addFiles(['components/chat_room/chat_room.html',
                   'components/chat_room/chat_room.scss',
                   'components/chat_room/chat_room.events.js',
                   'components/chat_room/chat_room.helpers.js',
                   'components/chat_room/chat_room.lifecycles.js',
                   'components/chat_room/chat_room_message_sender.js',
                   ],'client');
                   
     api.addFiles(['components/chat_room_information/chat_room_information.html',
                   'components/chat_room_information/chat_room_information.js'],'client');
                   
     api.addFiles(['components/chat_room_user/chat_room_users.html',
                   'components/chat_room_user/chat_room_users.js'],'client');
                   
     api.addFiles(['components/chat_setting/chat_setting.html',
                   'components/chat_setting/chat_setting.js'],'client');
                                                      

     api.addFiles(['components/chatoption/chatoption.html',
                   'components/chatoption/chatoption.js',
                   'components/chatoption/chatoption.css']
                   ,'client');  
     
     api.export('Smartix');                                    
     api.export('Chat');
     api.export('Schema');
     api.export('ChatRoomMessageSender');
});