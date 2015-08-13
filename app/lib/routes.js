Router.configure({
  /*layoutTemplate: 'MasterLayout',*/
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound'
});

var OnBeforeActions;

OnBeforeActions = {
  loginRequired: function(pause) {
    if (!Meteor.userId()) {
      Router.go('signin');
      this.next();
    } else {
      this.next();
    }
  },
  roleRequired: function() {
    if(!Meteor.user().profile.role){
      Router.go('role');
      this.next();
    }else{
      this.next();
    }

  }
};

Router.onBeforeAction(OnBeforeActions.loginRequired, {
  except: ['language', 'signin', 'email-signin','email-signup', 'role','Testing','Test2']
});

Router.onBeforeAction(OnBeforeActions.roleRequired, {
  only: ['home']
});




/*/lang
/create/:role/register
/login/
/login/:role/
/home/

lang->language*/


Router.route('language', {
  controller: 'LoginController',
  action: "language",
  path: "/"
});
Router.route('signin', {
  controller: 'LoginController',
  action: "signin"
});
Router.route('email-signin', {
  controller: 'LoginController',
  action: "emailsigin"
});
Router.route('email-signup', {
  controller: 'LoginController',
  action: "emailsigup",
  path: "email-signup/:role",
});

Router.route('role', {
  controller: 'LoginController',
  action: "role"
});

Router.route('dob', {
  controller: 'LoginController',
  action: "dob"
});

Router.route('Home', {
  controller: 'MainApplicationController',
});

Router.route('TabChat', {
  controller: 'MainApplicationController',
});

Router.route('You', {
  controller: 'MainApplicationController',
  action: "you"
});




Router.route('Classes', {
  controller: 'MainApplicationController',
  action: "classes"
});

Router.route('AddClass', {
  controller: 'ClassController',
  path: "class/add"
});

Router.route('JoinClass', {
  // controller: 'ClassController',
  layoutTemplate:"NavBarScreenLayout",
  path: "class/join",
});
Router.route('ClassInvitation', {
  controller: 'ClassWithIdController',
  path: "class/:classCode/invite"
});

Router.route('EmailInvite', {
  /*controller: 'ClassWithIdController',*/
  layoutTemplate:"NavBarScreenLayout",
  path: "class/:classCode/invite/byemail",

});




Router.route('classDetail', {
  controller: 'ClassWithIdController',
  path: "class/:classCode"
});
Router.route('ShareInvite', {
  controller: 'ClassWithIdController',
  path: "class/:classCode/invite/share"
});
Router.route('classEdit', {
  controller: 'ClassWithIdController',
  path: "class/:classCode/edit"
});

Router.route('ClassUsers', {
  controller: 'ClassWithIdController',
  path: "class/:classCode/users"
});

Router.route('UserDetail', {
  controller: 'UserController',
  path: "user/:_id"
});

Router.route('MyAccount', function(){
  this.layout('NavBarScreenLayout');
  this.render('MyAccount');
});

Router.route('SendMessage', {
  controller: 'MessageController',
  path: "message/send/:classCode?"
});

Router.route('Testing',{
  controller:"TestController",

  });

Router.route('Test2',{
  controller:"TestController",

  });
Router.route('sendChat',{
  layoutTemplate:"NavBarScreenLayout",
  path:"chat"

  });









/*


Router.map(function(){

	this.route("lang", {
		layoutTemplate:"PreMainLayout",
		path:"/"
	});
	this.route("login",{
		layoutTemplate:"PreMainLayout",
	});
	this.route("char",{
		layoutTemplate:"PreMainLayout",
		});
	this.route("create",{
		layoutTemplate:"MainLayout",
		path:"create/:char",
		onBeforeAction:function(){
			if(Meteor.user()){
				Router.go('home');
			}else{
				this.next();
			}
		},
		data:function(){
			var templateData={
				char:this.params.char
			};
			return templateData;
		}
	});
	this.route("signIn",{
		layoutTemplate:"MainLayout",
	}),
	this.route("home",{
		layoutTemplate:"MainLayout",
	}),
	this.route("TabChat",{
		layoutTemplate:"MainLayout",
		})

});*/



// Router.route("/SignUp",function  (argument) {
// 	this.layout("Home");
// 	this.render('HomeSignUp');
// })

// Router.route("/SignForm",function  (argument) {
// 	// this.layout("Home");
// 	this.render('SignForm');
// })

// Router.route("/SignInForm",function  (argument) {
// 	// this.layout("Home");
// 	this.render('SignInForm');
// })

// Router.routes('/lang');
// Router.routes('/login');
// Router.routes('/char');
// Router.routes('/create');
// Router.routes('/signin');


// Router.route('/', {
//   name: 'home',
//   controller: 'HomeController',
//   action: 'action',
//   where: 'client'
// });


// complex route with
// name 'authorDetail' that for example
// matches '/authors/1/edit' or '/authors/1' and automatically renders
// template 'authorDetail'
// HINT:
//// get parameter via this.params
//// the part '/edit' is optional because of '?'
// this.route('authorDetail', {
//   path: '/authors/:_id/edit?'
// });
