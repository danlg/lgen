Template.AdminUsersAdd.onCreated(function () {
    this.userRole = new ReactiveVar("student");
});

Template.AdminUsersAdd.helpers({
    template: function () {
        var currentRole = Template.instance().userRole.get();
        return currentRole === "student" ? "AdminUsersAddStudent" : "AdminUsersAddOthers";
    }
})

Template.AdminUsersAdd.events({
    'change #addUser-roles, focus #addUser-roles, blur #addUser-roles': function (event, template) {
        console.log(event.currentTarget.value);
        Template.instance().userRole.set(event.currentTarget.value);
    }
});