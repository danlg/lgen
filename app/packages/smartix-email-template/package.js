Package.describe({
	name: 'smartix:email-template',
	version: '0.0.1',
	summary: '',
	git: '',
	documentation: 'README.md'
});

Package.onUse(function(api) {
     api.versionsFrom("1.2"); 
     api.addAssets('emailMessageMasterTemplate.html','server');
     api.addAssets([
         
                    'lang/en/emailVerifyTemplate.Parent.html',
                    'lang/en/emailVerifyTemplate.Student.html',
                    'lang/en/emailVerifyTemplate.Teacher.html',
                    'lang/en/inviteClassMailTemplate.html',
                    'lang/en/newClass_MailTemplate.html',

                    'lang/fr/emailVerifyTemplate.Parent.html',
                    'lang/fr/emailVerifyTemplate.Student.html',
                    'lang/fr/emailVerifyTemplate.Teacher.html',
                    'lang/fr/inviteClassMailTemplate.html',
                    'lang/fr/newClass_MailTemplate.html',
                    
                    'lang/zh-CN/emailVerifyTemplate.Parent.html',
                    'lang/zh-CN/emailVerifyTemplate.Student.html',
                    'lang/zh-CN/emailVerifyTemplate.Teacher.html',
                    'lang/zh-CN/inviteClassMailTemplate.html',
                    'lang/zh-CN/newClass_MailTemplate.html',

                    'lang/zh-TW/emailVerifyTemplate.Parent.html',
                    'lang/zh-TW/emailVerifyTemplate.Student.html',
                    'lang/zh-TW/emailVerifyTemplate.Teacher.html',
                    'lang/zh-TW/inviteClassMailTemplate.html',
                    'lang/zh-TW/newClass_MailTemplate.html',                                                                                                                                                             
                    ]
                    ,'server');    
     api.addFiles('emailTemplate.js','server');
     
     
     api.export('Smartix');

});