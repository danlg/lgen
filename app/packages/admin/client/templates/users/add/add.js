Template.AdminUsersAdd.onCreated(function () {
    this.userRole = new ReactiveVar("student");
});

Template.AdminUsersAdd.helpers({
    template: function () {
        var currentRole = Template.instance().userRole.get();
        return currentRole === "student" ? "AdminAddStudent" : "AdminAddOthers";
    }
})

Template.AdminUsersAdd.events({
    'change #addUser-roles, focus #addUser-roles, blur #addUser-roles': function (event, template) {
        Template.instance().userRole.set(event.currentTarget.value);
    }
});