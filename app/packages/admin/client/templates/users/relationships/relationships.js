Template.AdminUsersAddRelationships.onCreated(function () {
    var self = this;
    
    this.UsersIndex = new EasySearch.Index({
        collection: Meteor.users,
        fields: ['profile.firstName', 'profile.lastName'],
        engine: new EasySearch.Minimongo(),
        defaultSearchOptions : {limit: 5}
    });
    
    var schoolUsername = Router.current().params.school;
    
    // Subscription for school info is already done at the admin layout's js file
    var schoolNamespace = Smartix.Accounts.School.getNamespaceFromSchoolName(schoolUsername)
    if(schoolNamespace) {
        self.subscribe('smartix:accounts/allUsersInNamespace', Smartix.Accounts.School.getNamespaceFromSchoolName(schoolUsername));
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

Template.AdminClassesView.events({
    'change #AdminUsersAddRelationships__relationship-type': function (event, template) {
        console.log(template.find('#AdminUsersAddRelationships__relationship-type').val());
        Template.instance().relationshipType.set(template.find('#AdminUsersAddRelationships__relationship-type').val());
    },
    'click .AdminUsersAddRelationships__user-search-result': function(event, template) {
        var userId = event.currentTarget.dataset.userId;
        var relName = template.find('#AdminUsersAddRelationships__relationship-type').val();
        if(!userId) {
            Toastr.error('Please select a user');
        }
        if (Router
            && Router.current()
            && Router.current().params.school
        ) {
            console.log(userId);
            console.log(Template.parentData(1));
            console.log(Template.parentData(2));
            console.log(Smartix.Accounts.School.getNamespaceFromSchoolName(Router.current().params.school));
            console.log(relName);
            return false;
            
            Meteor.call('smartix:accounts-relationships/createRelationship', {
                parent: userId,
                child: "",
                namespace: Smartix.Accounts.School.getNamespaceFromSchoolName(Router.current().params.school),
                name: ""
            }, function (err, res) {
                if(err) {
                    console.log(err);
                    toastr.error(err.message);
                }
            });
        } else {
            toastr.error(TAPi18n.__("applicationError.refreshRequired"));
        }
    }
});