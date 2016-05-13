Template.AdminClassesView.onCreated(function () {
    var self = this;
    if(Router.current()
    && Router.current().params
    && Router.current().params.classCode) {
        var currentClassCode = Router.current().params.classCode;
        
        // Subscribe to information about the class
        self.subscribe('smartix:classes/classByClassCode', currentClassCode, function (error, res) {
            if(!error) {
                
                // Get all users in the school so they can be searched
                
                
                // Used for getting class messages/announcements
                // var classData = Smartix.Groups.Collection.findOne({
                //     classCode: currentClassCode,
                //     type: 'class'
                // });
                
                // if(classData && classData._id) {
                //     self.subscribe('smartix:messages/groupMessages', classData._id);
                // }
            }
        });
        
        self.subscribe('smartix:classes/distributionListsOfClass', currentClassCode);
        
        var schoolUsername = Router.current().params.school;
        
        // Subscription for school info is already done at the admin layout's js file
        var schoolNamespace = Smartix.Accounts.School.getNamespaceFromSchoolName(schoolUsername)
        if(schoolNamespace) {
            self.subscribe('smartix:accounts/allUsersInNamespace', Smartix.Accounts.School.getNamespaceFromSchoolName(schoolUsername));
        }
    }
});


Template.AdminClassesView.helpers({
    classData: function () {
        if(Template.instance().subscriptionsReady()) {
            return Smartix.Groups.Collection.findOne({
                classCode: Router.current().params.classCode,
                type: 'class'
            });
        }
    },
    userData: function (data) {
        if(Template.instance().subscriptionsReady()) {
            return Meteor.users.findOne({
                _id: data
            });
        }
    },
    listData: function (data) {
        if(Template.instance().subscriptionsReady()) {
            return Smartix.Groups.Collection.findOne({
                _id: data
            });
        }
    },
    announcements: function () {
        if(Template.instance().subscriptionsReady()) {
            var classData = Smartix.Groups.Collection.findOne({
                classCode: Router.current().params.classCode,
                type: 'class'
            });
            if(classData && classData._id) {
                return Smartix.Messages.Collection.find({
                    group: classData._id
                });
            }
        }
    },
    classUserIndex: function () {
        return ClassUsersIndex;
    },
    adminAdminSearchInputAttributes: function () {
        return {
            placeholder: "Type the name of your new admin",
            class: "form-control",
            id: "AdminClassesView__add-admin-input"
        }
    },
    adminUserSearchInputAttributes: function () {
        return {
            placeholder: "Type the name of your new user",
            class: "form-control",
            id: "AdminClassesView__add-user-input"
        }
    }
});

Template.AdminClassesView.events({
    'click .AdminClassesView__user-search-add-admin': function(event, template) {
        var userId = event.target.dataset.userId;
        if (Router
            && Router.current()
            && Router.current().params
        ) {
            Meteor.call('smartix:classes/joinAsAdmin', {
                classCode: Router.current().params.classCode,
                schoolName: Router.current().params.school
            }, userId, function (err, res) {
                if(err) {
                    console.log(err);
                    toastr.error(err.message);
                }
            });
        } else {
            toastr.error(TAPi18n.__("applicationError.refreshRequired"));
        }
    },
    'click .AdminClassesView__user-search-add-user': function(event, template) {
        var userId = event.target.dataset.userId;
        if (Router
            && Router.current()
            && Router.current().params
        ) {
            Meteor.call('smartix:classes/join', {
                classCode: Router.current().params.classCode,
                schoolName: Router.current().params.school
            }, userId, function (err, res) {
                if(err) {
                    console.log(err);
                    toastr.error(err.message);
                }
            });
        } else {
            toastr.error(TAPi18n.__("applicationError.refreshRequired"));
        }
    },
    'click .remove-user': function (event, template) {
        // Get class Id from name 
        var classObj = Smartix.Groups.Collection.findOne({
            classCode: Router.current().params.classCode,
            type: "class"
        })
        
        var userId = event.currentTarget.dataset.userId;
        if(!classObj) {
            toastr.error('Could not find the class with class code ' + Router.current().params.classCode);
        }
        
        if(classObj && userId) {
            Meteor.call('smartix:classes/removeUsers', classObj._id, [userId], function (err, res) {
                // console.log(err);
                // console.log(res);
            });
        }
    },
    'click .remove-admin': function (event, template) {
        // Get class Id from name 
        var classObj = Smartix.Groups.Collection.findOne({
            classCode: Router.current().params.classCode,
            type: "class"
        })
        
        var userId = event.currentTarget.dataset.userId;
        if(!classObj) {
            toastr.error('Could not find the class with class code ' + Router.current().params.classCode);
        }
        
        if(classObj && userId) {
            Meteor.call('smartix:classes/removeAdmins', classObj._id, [userId], function (err, res) {
                // console.log(err);
                // console.log(res);
            });
        }
    },
    'click .remove-list': function (event, template) {
        // Get class Id from name 
        var classObj = Smartix.Groups.Collection.findOne({
            classCode: Router.current().params.classCode,
            type: "class"
        })
        
        var listId = event.currentTarget.dataset.listId;
        if(!classObj) {
            toastr.error('Could not find the class with class code ' + Router.current().params.classCode);
        }
        
        if(classObj && listId) {
            Meteor.call('smartix:classes/removeDistributionLists', classObj._id, [listId], function (err, res) {
                // console.log(err);
                // console.log(res);
            });
        }
    }
});