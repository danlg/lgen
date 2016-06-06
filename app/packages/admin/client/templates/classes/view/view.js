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
        
        var schoolUsername = Router.current().params.school;
        
        // Subscription for school info is already done at the admin layout's js file
        var schoolNamespace = Smartix.Accounts.School.getNamespaceFromSchoolName(schoolUsername)
        if(schoolNamespace) {
            self.subscribe('smartix:distribution-lists/listsInNamespace', schoolNamespace);
            self.subscribe('smartix:accounts/allUsersInNamespace', Smartix.Accounts.School.getNamespaceFromSchoolName(schoolUsername));
        }
    }

    this.DistributionListsIndex = new EasySearch.Index({
        collection: Smartix.Groups.Collection,
        fields: ['name', 'url'],
        engine: new EasySearch.Minimongo({
            selector: function(searchObject, options, aggregation) {

                // selector contains the default mongo selector that Easy Search would use
                var selector = this.defaultConfiguration().selector(searchObject, options, aggregation);

                // modify the selector to only match documents where region equals "New York"
                selector.type = "distributionList";
                selector.namespace = schoolNamespace;

                return selector;
            }
        }),
        // See https://github.com/matteodem/meteor-easy-search/issues/315
        defaultSearchOptions: {
            limit: 5 
        }
    });
    
    this.ClassUsersIndex = new EasySearch.Index({
        collection: Meteor.users,
        fields: ['profile.firstName', 'profile.lastName'],
        engine: new EasySearch.Minimongo(),
        // See https://github.com/matteodem/meteor-easy-search/issues/315
        defaultSearchOptions: {
            limit: 5 
        }
    });

    this.ClassAdminsIndex = new EasySearch.Index({
        collection: Meteor.users,
        fields: ['profile.firstName', 'profile.lastName'],
        engine: new EasySearch.Minimongo(),
        // See https://github.com/matteodem/meteor-easy-search/issues/315
        defaultSearchOptions: {
            limit: 5 
        }
    });
});


Template.AdminClassesView.helpers({
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
    classUserIndex: function () {
        return Template.instance().ClassUsersIndex;
    },
    classAdminIndex: function () {
        return Template.instance().ClassAdminsIndex;
    },
    distributionListIndex: function () {
        return Template.instance().DistributionListsIndex;
    },
    adminAdminSearchInputAttributes: function () {
        return {
            placeholder: TAPi18n.__("Admin.AdminSearchInput"),
            class: "form-control",
            id: "AdminClassesView__add-admin-input"
        }
    },
    adminUserSearchInputAttributes: function () {
        return {
            placeholder: TAPi18n.__("Admin.UserSearchInput"),
            class: "form-control",
            id: "AdminClassesView__add-user-input"
        }
    },
    adminListSearchInputAttributes: function () {
        return {
            placeholder: TAPi18n.__("Admin.ListSearchInput"),
            class: "form-control",
            id: "AdminClassesView__add-list-input"
        }
    }
});

Template.AdminClassesView.events({
    'click .AdminClassesView__admin-search-add': function(event, template) {
        var userId = event.target.dataset.adminId;
        if (Router
            && Router.current()
            && Router.current().params
        ) {
            Meteor.call('smartix:classes/joinAsAdmin', {
                classCode: Router.current().params.classCode,
                schoolName: Router.current().params.school
            }, userId, function (err, res) {
                if(err) {
                    //log.info(err);
                    toastr.error(err.message);
                }
            });
            window.setTimeout(function(){
                var list = template.$(".add-admin-result-container");
                var inputBox = template.$("#AdminClassesView__add-admin-input")
                inputBox[0].value = "";
                list[0].hidden = true;
                inputBox[0].onkeyup = function () {
                    list[0].hidden = false;
                }
            }, 0);
        } else {
            toastr.error(TAPi18n.__("applicationError.refreshRequired"));
        }
    },
    'click .AdminClassesView__user-search-add': function(event, template) {
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
                    //log.info(err);
                    toastr.error(err.message);
                }
            });
        window.setTimeout(function(){
            var list = template.$(".add-user-result-container");
            var inputBox = template.$("#AdminClassesView__add-user-input")
            inputBox[0].value = "";
            list[0].hidden = true;
            inputBox[0].onkeyup = function () {
                list[0].hidden = false;
            }
        }, 0);
        } else {
            toastr.error(TAPi18n.__("applicationError.refreshRequired"));
        }
    },
    'click .AdminClassesView__list-search-add': function (event, template) {
        var listId = event.target.dataset.listId;
        if (Router
            && Router.current()
            && Router.current().params
        ) {
            var classId = Smartix.Class.classIdFromClassCode(Router.current().params.classCode);
            if(classId) {
                Meteor.call('smartix:classes/addDistributionLists', classId, [listId], function (err, res) {
                    if(err) {
                        //log.info(err);
                        toastr.error(err.message);
                    }
                });
            } else {
                toastr.error(TAPi18n.__("applicationError.refreshRequired"));
            }
            window.setTimeout(function(){
                var list = template.$(".add-list-result-container");
                var inputBox = template.$("#AdminClassesView__add-list-input")
                inputBox[0].value = "";
                list[0].hidden = true;
                inputBox[0].onkeyup = function () {
                    list[0].hidden = false;
                }
            }, 0);            
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