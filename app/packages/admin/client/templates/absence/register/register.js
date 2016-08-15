Template.AdminAbsenceRegister.onCreated(function () {
    var self = this;
        // subscribe to the school info first
    var schoolUsername = UI._globalHelpers['getCurrentSchoolName']();
    self.subscribe('schoolInfo', schoolUsername, function () {
        var schoolNamespace = UI._globalHelpers['getCurrentSchoolId']();
        if(schoolNamespace) {
            self.subscribe('schoolStudents', schoolNamespace);
        }
    });
    this.isActualRegistration = new ReactiveVar(true);
    this.studentId = new ReactiveVar();
    this.isAbsent = new ReactiveVar(true);
});

Template.AdminAbsenceRegister.onRendered(function(){
    // this.$("#AdminAbsenceRegister__name").value = "Helo WOrd";
    this.$("#AdminAbsenceRegister__startDate").val(moment().format('YYYY-MM-DD'));
    this.$("#AdminAbsenceRegister__endDate").val(moment().add(1, 'day').format('YYYY-MM-DD'));
    this.$("#AdminAbsenceRegister__startTime").val('08:00');
    this.$("#AdminAbsenceRegister__endTime").val('08:00');
});

Template.AdminAbsenceRegister.events({
    
    'change #AdminRegisterAbsence__type, focus #AdminRegisterAbsence__type, blur #AdminRegisterAbsence__type': function (event, template){
        return (template.$('#AdminRegisterAbsence__type').eq(0).val() === 'Actual') ? template.isActualRegistration.set(true) : template.isActualRegistration.set(false); 
    },

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
    },

    'click .ActualAbsenceRegister__user-search-result': function (event, template) {
        var userId = event.currentTarget.dataset.userId;
        template.studentId.set(userId);
        if(!userId) {
            Toastr.error(TAPi18n.__("Admin.SelectUser"));
        }
        userObj = Meteor.users.findOne(userId);
        if (userObj.studentId) {
            // template.$('#ActualAbsenceRegister__studentId').val(userObj.studentId);
            log.info("Student ID", userObj.studentId)
        }
        template.find('#ActualAbsenceRegister__name').value = event.currentTarget.innerHTML;
        template.$(".ActualAbsenceRegister__user-search-result").hide(); 
    },

    'click #studentAbsentOrLate': function(event, template)
    {
       return template.$('#studentAbsentOrLate').is(":checked") ? template.isAbsent.set(false) : template.isAbsent.set(true);
    },

    'click #ActualAbsenceRegister__submit': function(event, template){
        options = {};
        var studentId = template.studentId.get();

        options.name = template.$('#ActualAbsenceRegister__name').val();
        options.studentId = template.$('#ActualAbsenceRegister__studentId').val();
        options.department = template.$('#ActualAbsenceRegister__department').val();
        let date = template.$("#ActualAbsenceRegister__date").val();
        options.date = moment(date).format('DD/MM/YYYY').toString();
        if (template.isAbsent.get()){
            options.absent = 'True';
        }
        else{
            options.clockIn = template.$("#ActualAbsenceRegister__checkInTime").val();
        }
        log.info("Options", options);
        Meteor.call('smartix:absence/updateAttendanceRecord', options, UI._globalHelpers['getCurrentSchoolName'](), function(err, res){
            if(err)
            {
                toastr.error(TAPi18n.__("Admin.UpdateFail"));
                log.error(err);
            }
            else{
                clearForm();
                toastr.info(TAPi18n.__("Admin.AbsenceAddSuccess"));
            }
        })
    }
});

Template.AdminAbsenceRegister.helpers({

    'isActualRegistration': function(){
        return Template.instance().isActualRegistration.get();
    },

    'adminAbsenceRegisterInputAttributes': function () {
        return {
            id: "AdminAbsenceRegister__name",
            class: "form-control",
            placeholder: TAPi18n.__("Students")
        }
    },
    'actualAbsenceRegisterInputAttributes': function () {
        return {
            id: "ActualAbsenceRegister__name",
            class: "form-control",
            placeholder: TAPi18n.__("Students")
        }
    },

    'isAbsent': function(){
        return Template.instance().isAbsent.get();
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
