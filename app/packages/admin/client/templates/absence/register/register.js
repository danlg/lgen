Template.AdminAbsenceRegister.onCreated(function () {
    var self = this;
    if (Router
        && Router.current()
        && Router.current().params
        && Router.current().params.school
    ) {
        // subscribe to the school info first
        var schoolUsername = Router.current().params.school;
        self.subscribe('schoolInfo', schoolUsername, function () {
            var schoolNamespace = Smartix.Accounts.School.getNamespaceFromSchoolName(schoolUsername)
            if(schoolNamespace) {
                self.subscribe('smartix:accounts/allUsersInNamespace', Smartix.Accounts.School.getNamespaceFromSchoolName(schoolUsername));
            }
        })
    } else {
        log.info("Please specify a school to list the users for");
    }
});

Template.AdminAbsenceRegister.events({
    'click .AdminAbsenceRegister__user-search-result': function (event, template) {
        Session.set('absent-student', event.currentTarget.dataset.userId);
        template.find('#AdminAbsenceRegister__name').value = event.currentTarget.innerHTML;
    },
    'click #AdminAbsenceRegister__submit': function (event, template) {
        
        event.preventDefault();
        
        options = {};
        
        options.namespace = Smartix.Accounts.School.getNamespaceFromSchoolName(Router.current().params.school);
        options.studentId = Session.get('absent-student');
        options.reporterId = Meteor.userId();
        
        let dateFrom = template.find("#AdminAbsenceRegister__startDate").value;
        let timeFrom = template.find("#AdminAbsenceRegister__startTime").value;
        let dateTo = template.find("#AdminAbsenceRegister__endDate").value;
        let timeTo = template.find("#AdminAbsenceRegister__endTime").value;
        
        options.dateFrom = moment(dateFrom + " " + timeFrom).unix();
        options.dateTo = moment(dateTo + " " + timeTo).unix();
        
        options.message = template.$('#AdminAbsenceRegister__message').val();
        
        Smartix.Absence.expectedAbsenceSchema.clean(options);
        
        Meteor.call('smartix:absence/registerExpectedAbsence', options, function (err, res) {
            //log.info(err);
            //log.info(res);
        });
    }
});

Template.AdminAbsenceRegister.helpers({
    'adminAbsenceRegisterInputAttributes': function () {
        return {
            id: "AdminAbsenceRegister__name",
            class: "form-control",
            placeholder: "Class Name"
        }
    },
    'absenceUsersIndex': function () {
        return AbsenceUsersIndex;
    }
})

Template.AdminAbsenceRegister.onDestroyed(function () {
    Session.set('absent-student', undefined);
})