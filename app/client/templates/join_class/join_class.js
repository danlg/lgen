var joinform;
/*****************************************************************************/
/* JoinClass: Event Handlers */
/*****************************************************************************/
Template.JoinClass.events({
  'click .joinBtn': function () {
    

    var classCodeInput = $(".classCodeInput").val().trim();

    if(classCodeInput == ""){
      
      alert(TAPi18n.__("JoinAClassByInputClassCode"));

      return false;
    }
    
    if(AutoForm.validateForm("joinClassForm")==false){
      return;
    }
      
    Meteor.call("class/search", classCodeInput, function (error, result) {
      if (error) {
        console.log("error", error);
      }
      if (!result) {
        alert(TAPi18n.__("NoClass"));
      } else {
        IonLoading.show();
        $(joinform).submit();

        if (Meteor.user().profile.firstclassjoined) {
          analytics.track("First Class Joined", {
            date: new Date(),
          });

          Meteor.call("updateProfileByPath", 'profile.firstclassjoined', false);
        }

      }
    });

  },
  'click .leaveBtn': function (e) {
    var classId = $(e.target).attr("data-classId");
    Meteor.call('class/leave', classId);
  }
});

/*****************************************************************************/
/* JoinClass: Helpers */
/*****************************************************************************/
Template.JoinClass.helpers({
  leaveClassSchema: Schema.leaveClass,
  joinClassSchema: Schema.joinClass,
  joinClassArr: function () {
    return Classes.find({joinedUserId: {$in: [Meteor.userId()]}});
  }
});

/*****************************************************************************/
/* JoinClass: Lifecycle Hooks */
/*****************************************************************************/
Template.JoinClass.created = function () {
};

Template.JoinClass.rendered = function () {
  joinform = this.$("#joinClassForm");


};

Template.JoinClass.destroyed = function () {
};

Template.ionNavBar.events({
  'click .doneClassBtn': function (e, template) {
    Router.go('TabClasses')
  }
});
