Router.configure({
	layoutTemplate: 'MasterLayout',
	loadingTemplate: 'Loading',
	notFoundTemplate: 'NotFound'
});

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
	});
	this.route("signIn",{
		layoutTemplate:"MainLayout",
	})

});



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
