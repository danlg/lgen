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
    classObj = Classes.findOne({classCode:this.params.classCode});

    return {
      classObj:classObj,
      inviteClassSchema : Schema.inviteClass,
      joinClassSchema : Schema.joinClass,
      leaveClassSchema : Schema.leaveClass,
      joinClassArr: Classes.find({joinedUserId:Meteor.userId()}).fetch(),

    }
  },

  action: function () {
    // You can create as many action functions as you'd like.
    // This is the primary function for running your route.
    // Usually it just renders a template to a page. But it
    // might also perform some conditional logic. Override
    // the data context by providing it as an option in the
    // last parameter.
    this.render('Class', { /* data: {} */});
  },
  add:function(){
    this.render("AddClass");
  },
  join:function(){
    this.render("JoinClass");
  },
  invite:function(){
    /*this.render("ClassInvitation",{
      data:{
        inviteClassSchema: Schema.inviteClass,
        classCode:this.params.classCode

      }
      });*/
      this.render("ClassInvitation")
  },
  detail:function(){
    this.render("ClassDetail");
  },
  emailinvite:function(){
    this.render("EmailInvite");
  },
  edit:function(){
    this.render("ClassEdit");
  },
  users:function(){
    this.render("ClassUsers");
  }


});
