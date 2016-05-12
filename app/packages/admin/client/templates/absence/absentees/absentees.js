Template.AdminAbsentees.onCreated(function () {
    var self = this;
    if(Router
    && Router.current()
    && Router.current().params.school) {
        var schoolUsername = Router.current().params.school;
        self.subscribe('schoolInfo', schoolUsername, function () {
            self.schoolNamespace = Smartix.Accounts.School.getNamespaceFromSchoolName(schoolUsername);
            
            if(self.schoolNamespace) {
                self.subscribe('schoolAdmins', self.schoolNamespace);
                self.subscribe('smartix:absence/allAbsences', self.schoolNamespace, function () {
                    self.subscribe('smartix:absence/absentUsers', self.schoolNamespace, function () {
                    });
                });
                self.subscribe('smartix:absence/expectedAbsences', self.schoolNamespace);
            }
        });
    }
});

Template.AdminAbsentees.helpers({
    'absentees': function () {
        return Smartix.Absence.Collections.processed.find({
            namespace: Template.instance().schoolNamespace
        });
    },
    'labelClass': function () {
        switch(this.status) {
            case 'approved':
                return 'success';
            case 'pending':
                return 'info';
            default:
                return 'danger';
        }
    },
    'userData': function () {
        return Meteor.users.findOne({
            _id: this.studentId
        });
    },
    'lastNotified': function () {
        if(this.lastNotified) {
            return moment(this.lastNotified * 1000).format("HH:mm");
        } else {
            return "-";
        }
    },
    'arrivalTime': function () {
        if(this.clockIn) {
            return moment(this.date + " 00:00", 'DD-MM-YYYY').add(this.clockIn, "minutes").format("HH:mm");
        } else {
            return "-";
        }
    },
    'eta': function () {
        if(Array.isArray(this.expectedAbsenceRecords)) {
            var expectedAbsenceRecords = Smartix.Absence.Collections.expected.find({
                _id: {
                    $in: this.expectedAbsenceRecords
                }
            });
            
            if(expectedAbsenceRecords.count() > 0) {
                var etaTimestamp = _.reduce(expectedAbsenceRecords.fetch(), function (timestamp, rec) {
                    timestamp = Math.max(timestamp, rec.dateTo);
                    return timestamp;
                }, 0);
                return moment(new Date(etaTimestamp * 1000)).format('HH:mm');
            } else {
                return "-";
            }
        } else {
            return "-";
        }
    },
    'admin': function () {
        if(Array.isArray(this.expectedAbsenceRecords)) {
            var expectedAbsenceRecord = Smartix.Absence.Collections.expected.findOne({
                _id: {
                    $in: this.expectedAbsenceRecords
                },
                adminId: {
                    $exists: true
                }
            }, {
                sort: {dateFrom: 1}
            });
            
            if(expectedAbsenceRecord) {
                var admin = Meteor.users.findOne({
                    _id: expectedAbsenceRecord.adminId
                });
                if(admin) {
                    return admin.profile.firstName + " " + admin.profile.lastName;
                } else {
                    return "-";
                }
            } else {
                return "-";
            }
        } else {
            return "-";
        }
    }
})

Template.AdminAbsentees.events({
    'click .AdminAbsentees__changeStatus': function (event, template) {
        var processedId = event.currentTarget.dataset.id;
        var expectedAbsence = Smartix.Absence.Collections.processed.findOne({
            _id: processedId
        });
        var expectedAbsenceId;
        if(expectedAbsence && Array.isArray(expectedAbsence.expectedAbsenceRecords)) {
            expectedAbsenceId = expectedAbsence.expectedAbsenceRecords[0];
        }
        
        var status = event.currentTarget.dataset.status;
        
        console.log('processedId:', processedId);
        console.log('expectedAbsenceId:', expectedAbsenceId);
        console.log('status:', status);
        switch(status) {
            case "missing":
                // Send notification
                Meteor.call('smartix:absence/notifyParent', processedId);
                break;
            case "approved":
                // Unapprove
                Meteor.call('smartix:absence/unapproveExpectedAbsence', expectedAbsenceId);
                break;
            case "pending":
                // Approve
                Meteor.call('smartix:absence/approveExpectedAbsence', expectedAbsenceId);
                break;
        }
    }
})
