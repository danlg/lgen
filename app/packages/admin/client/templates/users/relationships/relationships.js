Template.AdminUsersAddRelationships.onCreated(function () {
    var self = this;
    
    this.UsersIndex = new EasySearch.Index({
        collection: Meteor.users,
        fields: ['profile.firstName', 'profile.lastName'],
        engine: new EasySearch.Minimongo(),
        defaultSearchOptions : {limit: 5}
    });
    
    var schoolUsername = UI._globalHelpers['getCurrentSchoolName']();
    // Subscription for school info is already done at the admin layout's js file
    var schoolNamespace = UI._globalHelpers['getCurrentSchoolId']();
    if(schoolNamespace) {
        self.subscribe('smartix:accounts/allUsersInNamespace', schoolNamespace);
    }
    
    this.relationshipType = new ReactiveVar("Mother");
});


Template.AdminUsersAddRelationships.helpers({
    usersIndex: function () {
        return Template.instance().UsersIndex;
    },
    userSearchInputAttributes: function () {
        return {
            placeholder: "e.g. Ben Forster",
            class: "form-control",
            id: "AdminUsersAddRelationships__input"
        }
    },
    relationshipType: function () {
        return Template.instance().relationshipType.get();
    }
});

Template.AdminUsersAddRelationships.events({
    'change #AdminUsersAddRelationships__relationship-type, focus #AdminUsersAddRelationships__relationship-type, blur #AdminUsersAddRelationships__relationship-type': function (event, template) {
        Template.instance().relationshipType.set(template.$('#AdminUsersAddRelationships__relationship-type').eq(0).val());
    },
    'click .AdminUsersAddRelationships__user-search-result': function(event, template) {
        var userId = event.currentTarget.dataset.userId;
        var relName = template.$('#AdminUsersAddRelationships__relationship-type').eq(0).val();
        if(!userId) {
            Toastr.error(TAPi18n.__("Admin.SelectUser"));
        }
        if (UI._globalHelpers['getCurrentSchoolName']()) {            
            Meteor.call('smartix:accounts-relationships/createRelationship', {
                parent: userId,
                child: Router.current().params.uid,
                namespace: UI._globalHelpers['getCurrentSchoolId'](),
                name: relName
            }, function (err, res) {
                if(err) {
                    //log.info(err);
                    toastr.error(err.message);
                }
            });
        window.setTimeout(function(){
            var list = template.$(".AdminUsersAddRelationships__results-container");
            var inputBox = template.$(".AdminUsersAddRelationships__user-search-result")
            inputBox[0].value = "";
            list[0].hidden = true;
            inputBox[0].onkeyup = function () {
                list[0].hidden = false;
            }
        }, 0);
        } else {
            toastr.error(TAPi18n.__("applicationError.refreshRequired"));
        }
    }
});