/*****************************************************************************/
/* EmailSignin: Event Handlers */
/*****************************************************************************/
Template.EmailSignin.events({});

/*****************************************************************************/
/* EmailSignin: Helpers */
/*****************************************************************************/
Template.EmailSignin.helpers({});

/*****************************************************************************/
/* EmailSignin: Lifecycle Hooks */
/*****************************************************************************/
Template.EmailSignin.created = function () {
};

Template.EmailSignin.rendered = function () {
  loginVM.bind(this);
};

Template.EmailSignin.destroyed = function () {
};

Template.ionNavBar.events({
  'click .loginBtn': function () {
    var loginObj = loginVM.toJS();
    // loginObj.email = loginObj.email.toUpperCase();
    Meteor.loginWithPassword(loginObj.email, loginObj.pwd, function (err) {
      // err?alert(err.reason);Router.go('TabClasses');
      if (err){
        alert("user not found");
        log.error(err);
      }
      else {
          var classToBeJoined = Session.get("search");
          if (classToBeJoined) {

            var doc = {classCode: classToBeJoined};
            //help user to join class directly and router go to the class page
            Meteor.call("class/join", doc, function (error, result) {

              log.info(error);
              log.info(result);
              if (error) {
                log.error("error", error);
                Router.go("TabClasses");
              } else {
                Session.set("search","");
                log.info("Redirecting you to the class");
                Router.go("classDetail",{classCode : classToBeJoined});
              }
            });

          } else {
            Router.go("TabClasses");
          }
      }
    });
  }
});
