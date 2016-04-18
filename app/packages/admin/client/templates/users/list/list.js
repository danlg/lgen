Template.AdminUsersSearch.onCreated(function () {
    if (Router
    && Router.current()
    && Router.current().params
    && Router.current().params.school
    ) {
        this.subscribe('allSchoolUsers', Router.current().params.school);
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