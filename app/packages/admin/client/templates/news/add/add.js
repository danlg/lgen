Template.AdminNewsAdd.onCreated(function () {
    this.autorun(() => {
        this.currentSchoolName = new ReactiveVar('currentSchoolName');
        if(Router
            && Router.current()
            && Router.current().params
            && Router.current().params.school
        ) {
            this.currentSchoolName = Router.current().params.school;
            this.subscribe('schoolInfo', this.currentSchoolName, (err, res) => {
                if(!err) {
                    this.subscribe('smartix:newsgroups/allNewsgroupsFromSchoolName', this.currentSchoolName, function (err, res) {
                        // console.log(err);
                        // console.log(res);
                    });
                }
            });
        }
        
    })
    
});

Template.AdminNewsAdd.helpers({
    newsgroups: function () {
        if(Template.instance().subscriptionsReady()) {
            var schoolDoc = SmartixSchoolsCol.findOne({
                username: Template.instance().currentSchoolName
            });
            if(schoolDoc) {
                return Smartix.Groups.Collection.find({
                    namespace: schoolDoc._id,
                    type: 'newsgroup'
                });
            }
        }
    }
})

Template.AdminNewsAdd.events({
    'click #addNews-submit': function (event, template) {

        var title = $('#addNews-title').val();
        var content = $('#addNews-content').val();
        var doPushNotification = document.getElementById("addNews-push-notification").checked
        console.log('doPushNotification',doPushNotification);
        event.preventDefault();

        $("input[type='checkbox'][name='addNews-newsgroup']").each(function (index) {
            if (this.checked) {
                Meteor.call('smartix:messages/createNewsMessage', this.value, 'article', { content: content, title: title }, null,doPushNotification);
            }
        });
    }
});