var header = ['User Name']
this.SchoolUserPages = new Meteor.Pagination(Meteor.users,{
    templateName: "SchoolUserList",
    table: {
        header: header
    },
    itemTemplate: "SchoolUserListItem",
    perPage: 5
});