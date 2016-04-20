Template.AdminClassesView.onCreated(function () {
    var self = this;
    self.subscribe('smartix:classes/classByClassCode', Router.current().params.classCode, function (error, res) {
        if(!error) {
            var classData = Smartix.Groups.Collection.findOne({
                classCode: Router.current().params.classCode,
                type: 'class'
            });
            self.subscribe('smartix:messages/groupMessages', classData._id);
        }
    });
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
    announcements: function () {
        if(Template.instance().subscriptionsReady()) {
            var classData = Smartix.Groups.Collection.findOne({
                classCode: Router.current().params.classCode,
                type: 'class'
            });
            if(classData) {
                return Smartix.Messages.Collection.find({
                    group: classData._id
                });
            }
        }
    },
    classUserIndex: function () {
        return ClassUsersIndex;
    },
    adminUserSearchInputAttributes: function () {
        return {
            placeholder: "Type the name of your new admin",
            class: "form-control",
            id: "AdminClassesView__add-admin-input"
        }
    }
});