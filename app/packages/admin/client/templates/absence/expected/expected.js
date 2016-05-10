Template.AdminAbsenceExpected.onCreated(function () {
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
                self.subscribe('smartix:absence/expectedAbsences', schoolNamespace, function () {
                    self.subscribe('smartix:absence/expectedAbsencesUsers', schoolNamespace, function () {
                        
                    })
                });
            } else {
                log.info("Could not find school with code " + schoolUsername);
            }
        })
    } else {
        log.info("Please specify a school to list the users for");
    }
});

Template.AdminAbsenceExpected.helpers({
    expectedAbsence: function () {
        return Smartix.Absence.Collections.expected.find();
    },
    userData: function () {
        return Meteor.users.findOne({
            _id: this.studentId
        })
    },
    startDateTime: function () {
        // This will be converted to the client's local timezone automatically
        return moment(this.dateFrom * 1000).format("DD-MM-YYYY HH:mm");
    },
    endDateTime: function () {
        // This will be converted to the client's local timezone automatically
        return moment(this.dateTo * 1000).format("DD-MM-YYYY HH:mm");
    }
});

Template.AdminAbsenceExpected.events({
    'click .AdminAbsenceExpected__unapprove': function () {
        Meteor.call('smartix:absence/unapproveExpectedAbsence', this._id);
    },
    'click .AdminAbsenceExpected__approve': function () {
        Meteor.call('smartix:absence/approveExpectedAbsence', this._id);
    }
})