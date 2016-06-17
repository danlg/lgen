Template.AdminAbsenceRegister.onCreated(function () {
    var self = this;
        // subscribe to the school info first
    var schoolUsername = UI._globalHelpers['getCurrentSchoolName']();
    self.subscribe('schoolInfo', schoolUsername, function () {
        var schoolNamespace = UI._globalHelpers['getCurrentSchoolId']();
        if(schoolNamespace) {
            self.subscribe('smartix:accounts/allUsersInNamespace', schoolNamespace);
        }
    })
});

Template.AdminAbsenceRegister.events({
    'click .AdminAbsenceRegister__user-search-result': function (event, template) {
        Session.set('absent-student', event.currentTarget.dataset.userId);
        template.find('#AdminAbsenceRegister__name').value = event.currentTarget.innerHTML;
    },
    'click #AdminAbsenceRegister__submit': function (event, template) {
        
        event.preventDefault();
        
        options = {};
        
        options.namespace = UI._globalHelpers['getCurrentSchoolId']();
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