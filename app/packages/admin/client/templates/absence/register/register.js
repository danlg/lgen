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
    this.studentId = new ReactiveVar();
});

Template.AdminAbsenceRegister.onRendered(function(){
    // this.$("#AdminAbsenceRegister__name").value = "Helo WOrd";
    this.$("#AdminAbsenceRegister__startDate").val(moment().format('YYYY-MM-DD'));
    this.$("#AdminAbsenceRegister__endDate").val(moment().add(1, 'day').format('YYYY-MM-DD'));
    this.$("#AdminAbsenceRegister__startTime").val('08:00');
    this.$("#AdminAbsenceRegister__endTime").val('08:00');
});

Template.AdminAbsenceRegister.events({
    'click .AdminAbsenceRegister__user-search-result': function (event, template) {
        var userId = event.currentTarget.dataset.userId;
        if(!userId) {
            Toastr.error(TAPi18n.__("Admin.SelectUser"));
        }
        template.studentId.set(userId);
        template.find('#AdminAbsenceRegister__name').value = event.currentTarget.innerHTML;
        template.$(".AdminAbsenceRegister__user-search-result").hide(); 
    },
    'click #AdminAbsenceRegister__submit': function (event, template) {
        
        event.preventDefault();
        
        options = {};
        
        options.namespace = UI._globalHelpers['getCurrentSchoolId']();
        options.studentId = template.studentId.get();
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
            if(err)
            {
                toastr.error(TAPi18n.__("Admin.UpdateFail"));
                log.error(err);
            }
            else{
                clearForm();
                toastr.info(TAPi18n.__("Admin.AbsenceAddSuccess"));
            }
        });
    }
});

Template.AdminAbsenceRegister.helpers({
    'adminAbsenceRegisterInputAttributes': function () {
        return {
            id: "AdminAbsenceRegister__name",
            class: "form-control",
            placeholder: TAPi18n.__("Students")
        }
    },
    'absenceUsersIndex': function () {
        return AbsenceUsersIndex;
    }
})

Template.AdminAbsenceRegister.onDestroyed(function () {
    Session.set('absent-student', undefined);
})

var clearForm = function ( ) {
    // Clear form values
    $('#AdminAbsenceRegister__name').val("");
    $('#AdminAbsenceRegister__message').val("");
    $("#AdminAbsenceRegister__startDate").val(moment().format('YYYY-MM-DD'));
    $("#AdminAbsenceRegister__endDate").val(moment().add(1, 'day').format('YYYY-MM-DD'));
    $("#AdminAbsenceRegister__startTime").val('08:00');
    $("#AdminAbsenceRegister__endTime").val('08:00');
};
