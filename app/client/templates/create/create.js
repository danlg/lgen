/*****************************************************************************/
/* Create: Event Handlers */
/*****************************************************************************/
Template.Create.events({

});

/*****************************************************************************/
/* Create: Helpers */
/*****************************************************************************/
Template.Create.helpers({
});

/*****************************************************************************/
/* Create: Lifecycle Hooks */
/*****************************************************************************/
Template.Create.created = function () {
};

Template.Create.rendered = function () {
};

Template.Create.destroyed = function () {
};


Template.Create.viewmodel({
  first: '',
  last: '',
  email:'',
  pwd:'',
  create:function  (argument) {
  	Accounts.createUser({
		"username":this.first()+" "+this.last(),
		"email":this.email(),
		"password":this.pwd(),
		"profile":{}
	},function(err){
		console.log(err);
	});
  }

});