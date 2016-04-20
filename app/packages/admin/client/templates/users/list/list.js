Template.AdminUsersSearch.onCreated(function () {
    var self = this;
    if (Router
    && Router.current()
    && Router.current().params
    && Router.current().params.school
    ) {
        // subscribe to the school info first
        var schoolUsername = Router.current().params.school;
        self.subscribe('schoolInfo', schoolUsername, function () {
            self.subscribe('smartix:accounts/allUsersInNamespace', Smartix.Accounts.School.getNamespaceFromSchoolName(schoolUsername));
        })
        
    } else {
        console.log("Please specify a school to list the users for");
    }
});

Template.AdminUsersSearch.helpers({
  usersIndex: function () {
      return UsersIndex;
  },
  routeData: function () {
        if (Router && Router.current()) {
            return {
                uid: this._id,
                school: Router.current().params.school
            };
        }
    }
});