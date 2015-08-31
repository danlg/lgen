/*****************************************************************************/
/* Role: Event Handlers */
/*****************************************************************************/
Template.Role.events({
  "click .button":function(e){
    var $this = $(e.target);
    if(Meteor.user()){
      Meteor.call('user/role/update',$this.data('role'),function(){
          Router.go('TabChat');
        });
    }else{
      Router.go('email-signup',{role:$this.data('role')});
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
  // if(Meteor.user()){
  //   var userObj=Meteor.user();
  //     /*if(!_.pick(userObj,'role')=='')*/
  //       Router.go('TabChat');
  // }
  IonModal.open('_modal');
};

Template.Role.destroyed = function () {
};


Template._modal.events({
    'click .role':function(e){
      IonModal.close('_modal');
      var role =  $(e.target).data('role');
      if(Meteor.userId()){

        Meteor.call('user/role/update',role,function(){
            Router.go('TabChat');
          });

      }else{

        Router.go("email-signup",{role:role});
      }
    }

});
