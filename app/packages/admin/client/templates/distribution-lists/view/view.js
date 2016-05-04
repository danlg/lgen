Template.AdminDistributionListView.onCreated(function () {
    var self = this;
    if(Router.current()
    && Router.current().params
    && Router.current().params.code) {
        var currentCode = Router.current().params.code;
        var schoolName = Router.current().params.school;
        self.subscribe('schoolInfo', schoolName, function (err, res) {
            var schoolId = Smartix.Accounts.School.getNamespaceFromSchoolName(schoolName);
            self.subscribe('smartix:distribution-lists/listByCode', currentCode, function (error, res) {
                self.subscribe('smartix:accounts/basicInfoOfAllUsersInNamespace', schoolId, function (err, res) {
                    
                });
                
                // if(!error) {
                //     var listData = Smartix.Groups.Collection.findOne({
                //         url: currentCode,
                //         type: 'distributionList'
                //     });
                    
                //     // if(listData && listData._id) {
                //     //     self.subscribe('smartix:messages/groupMessages', listData._id);
                //     // }
                // }
            });
        });
    }
});

Template.AdminDistributionListView.helpers({
    listData: function () {
        if(Template.instance().subscriptionsReady()) {
            return Smartix.Groups.Collection.findOne({
                url: Router.current().params.code,
                type: 'distributionList'
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
    distributionListUsersIndex: function () {
        return DistributionListUsersIndex;
    },
    adminUserSearchInputAttributes: function () {
        return {
            placeholder: "Type the name of your new admin",
            class: "form-control",
            id: "AdminDistributionListView__add-user-input"
        }
    }
});

Template.AdminDistributionListView.events({
    'click .AdminDistributionListView__user-search-result': function (event, template) {
        
        var userToAdd = event.currentTarget.dataset.userId;
        var currentList;
        if(Router.current()
        && Router.current().params
        && Router.current().params.code) {
            currentList = Router.current().params.code;
        }
        
        if(userToAdd && currentList) {
            Meteor.call('smartix:distribution-lists/addUsersByListName', currentList, [userToAdd], function (err, res) {
                // console.log(err);
                // console.log(res);
            })
        }
    },
    'click .AdminDistributionListView__remove-user': function (event, template) {
        
        var userToRemove = event.currentTarget.dataset.userId;
        var currentList;
        if(Router.current()
        && Router.current().params
        && Router.current().params.code) {
            currentList = Router.current().params.code;
        }
        
        if(userToRemove && currentList) {
            Meteor.call('smartix:distribution-lists/removeUsersByListName', currentList, [userToRemove], function (err, res) {
                // console.log(err);
                // console.log(res);
            })
        }
    }
});