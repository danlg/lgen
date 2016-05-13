var header = ['User Name','First Name','Last Name','Email','Roles','Edit User','Remove User']


this.SchoolUserPages = new Meteor.Pagination(Meteor.users,{
    templateName: "SchoolUserList",
    table: {
        header: header,
        class : 'table'
    },
    itemTemplate: "SchoolUserListItem",
    perPage: 5,
    availableSettings: {
        filters : true
    }    
});