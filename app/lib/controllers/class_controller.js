ClassController = RouteController.extend({
  layoutTemplate:"NavBarScreenLayout",
  subscriptions: function () {
    // set up the subscriptions for the route and optionally
    // wait on them like this:
    //
    // this.subscribe('item', this.params._id).wait();
    //
    // "Waiting" on a subscription does not block. Instead,
    // the subscription handle is added to a reactive list
    // and when all items in this list are ready, this.ready()
    // returns true in any of your route functions.
  },

  data: function () {


    // return a global data context like this:
    // Items.findOne({_id: this.params._id});
    /*classObj = Classes.findOne({classCode:this.params.classCode});



    return {
      classObj:classObj,
      inviteClassSchema : Schema.inviteClass,
      joinClassSchema : Schema.joinClass,
      leaveClassSchema : Schema.leaveClass,
      joinClassArr: Classes.find({joinedUserId:Meteor.userId()}).fetch(),

    }*/
    return {
      usersProfile : Meteor.users.find(),
    }
  }
});

ClassWithIdController = ClassController.extend({
  subscriptions:function(){
    this.subscribe('class',this.params.classCode).wait();
    if (this.ready()) {
      this.render();
    } else {
      this.render('Loading');
    }
  },
  data:function(){
    var classObj = Classes.findOne({classCode:this.params.classCode});
    return{
      classObj:classObj,
      classCode : this.params.classCode,
    }
  }
});
