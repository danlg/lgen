/*****************************************************************************/
/* Role: Event Handlers */
/*****************************************************************************/
Template.Role.events({
  "click .button":function(e){
    var $this = $(e.target);
    if(Meteor.user()){
      Meteor.call('user/role/update',$this.data('role'),function(){
          Router.go('Home');
        });
    }else{
      Router.go('email-signup',{role:$this.data('role')})
    }
  }
});

/*****************************************************************************/
/* Role: Helpers */
/*****************************************************************************/
Template.Role.helpers({
  "char":["Teacher","Student","Parent"]
});

/*****************************************************************************/
/* Role: Lifecycle Hooks */
/*****************************************************************************/
Template.Role.created = function () {
};

Template.Role.rendered = function () {
  if(Meteor.user()){
    var userObj=Meteor.user();
      /*if(!_.pick(userObj,'role')=='')*/
        Router.go('Home');
  }
};

Template.Role.destroyed = function () {
};
