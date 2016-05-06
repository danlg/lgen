Package.describe({
	name: 'smartix:email-template',
	version: '0.0.1',
	summary: '',
	git: '',
	documentation: 'README.md'
});

Package.onUse(function(api) {
     api.versionsFrom("1.2"); 
     api.use('ecmascript');
     api.use('smartix:core');
     api.use('dburles:spacebars-tohtml');
     
     api.addAssets('emailMessageMasterTemplate.html','server');
     api.addAssets([
         
                    'lang/en/emailNotifyJoinClassTemplate.html',
                    'lang/en/emailVerifyTemplate.html',
                    'lang/en/emailVerifyTemplate.Parent.html',
                    'lang/en/emailVerifyTemplate.Student.html',
                    'lang/en/emailVerifyTemplate.Teacher.html',
                    'lang/en/emailInviteClassTemplate.html',
                    'lang/en/emailNewClassTemplate.html',
                    
                    'lang/fr/emailNotifyJoinClassTemplate.html',
                    'lang/fr/emailVerifyTemplate.html',
                    'lang/fr/emailVerifyTemplate.Parent.html',
                    'lang/fr/emailVerifyTemplate.Student.html',
                    'lang/fr/emailVerifyTemplate.Teacher.html',
                    'lang/fr/emailInviteClassTemplate.html',
                    'lang/fr/emailNewClassTemplate.html',
                    
                    'lang/zh-CN/emailNotifyJoinClassTemplate.html',
                    'lang/zh-CN/emailVerifyTemplate.html',
                    'lang/zh-CN/emailVerifyTemplate.Parent.html',
                    'lang/zh-CN/emailVerifyTemplate.Student.html',
                    'lang/zh-CN/emailVerifyTemplate.Teacher.html',
                    'lang/zh-CN/emailInviteClassTemplate.html',
                    'lang/zh-CN/emailNewClassTemplate.html',
                    
                    'lang/zh-TW/emailNotifyJoinClassTemplate.html',
                    'lang/zh-TW/emailVerifyTemplate.html',
                    'lang/zh-TW/emailVerifyTemplate.Parent.html',
                    'lang/zh-TW/emailVerifyTemplate.Student.html',
                    'lang/zh-TW/emailVerifyTemplate.Teacher.html',
                    'lang/zh-TW/emailInviteClassTemplate.html',
                    'lang/zh-TW/emailNewClassTemplate.html',
                    ]
                    ,'server');    
     api.addFiles('emailTemplate.js','server');
     
     
     api.export('Smartix');

});