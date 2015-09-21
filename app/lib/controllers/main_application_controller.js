MainApplicationController = RouteController.extend({
  layoutTemplate: "NavBarScreenLayout",
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
    this.subscribe('joinedClass').wait();
    this.subscribe('createdClassByMe').wait();
  },

  data: function () {
    // return a global data context like this:
    // Items.findOne({_id: this.params._id});
  },


  you: function () {

    this.render('TabYou', {
      data: {
        _id: Meteor.userId(),
      }
    });
  },
  chat: function () {

    this.render('TabChat');
  },
  classes: function () {

    this.render('TabClasses');
  }

});
