Template.AdminAbsentees.onCreated(function () {
    var self = this;
        self.schoolNamespace = UI._globalHelpers['getCurrentSchoolId']();
        if(self.schoolNamespace) {
            self.subscribe('schoolAdmins', self.schoolNamespace);
            self.subscribe('smartix:absence/allAbsences', self.schoolNamespace, function () {
                self.subscribe('smartix:absence/absentUsers', self.schoolNamespace, function () {
                });
            });
            self.subscribe('smartix:absence/expectedAbsences', self.schoolNamespace);
        }   
    // Set defaults for the filter
    
    this.processedAbsencesFilter = new ReactiveDict();
    this.processedAbsencesFilter.set('from', moment(Date.now()).format("YYYY-MM-DD"));
    this.processedAbsencesFilter.set('to', moment(Date.now()).add(1, 'day').format("YYYY-MM-DD"));
    this.processedAbsencesFilter.set('status', "any");
    this.processedAbsencesFilter.set('name', undefined);
});

Template.AdminAbsentees.helpers({
    filterStartDate: function () {
        return Template.instance().processedAbsencesFilter.get('from');
    },
    filterEndDate: function () {
        return Template.instance().processedAbsencesFilter.get('to');
    },
    'absentees': function () {
        
        var dateFrom = moment(Template.instance().processedAbsencesFilter.get('from'), "YYYY-MM-DD").format("DD-MM-YYYY");
        var dateTo = moment(Template.instance().processedAbsencesFilter.get('to'), "YYYY-MM-DD").format("DD-MM-YYYY");
        var status = Template.instance().processedAbsencesFilter.get('status');
        var name = Template.instance().processedAbsencesFilter.get('name');
        
        var usersWithMatchingNameIds = [];
        
        if(name) {
            // Find all users with 
            var usersWithMatchingName = Meteor.users.find({
                $or: [
                    {
                        "profile.firstName": {
                            $regex : name
                        }
                    },
                    {
                        "profile.lastName": {
                            $regex : name
                        }
                    }
                ]
                
            }).fetch();
            
            usersWithMatchingNameIds = _.map(usersWithMatchingName, function (user) {
                return user._id;
            })
        }
        
        var studentIdSelector = usersWithMatchingNameIds.length > 0 ? {$in: usersWithMatchingNameIds} : {$exists: true};
        
        //log.info(usersWithMatchingNameIds);
        
        if(status === "any") {
            status = {$exists: true};
        }
        
        return Smartix.Absence.Collections.processed.find({
            studentId: studentIdSelector,
            date: {
                $lte: dateTo,
                $gte: dateFrom
            },
            status: status,
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
    'click #AdminAbsenceProcessed__updateFilter': function (event, template) {
        Template.instance().processedAbsencesFilter.set('from', template.$('#AdminAbsenceProcessed__startDate').eq(0).val());
        Template.instance().processedAbsencesFilter.set('to', template.$('#AdminAbsenceProcessed__endDate').eq(0).val());
        Template.instance().processedAbsencesFilter.set('status', template.$("input[name='status-filter']:checked").val());
        Template.instance().processedAbsencesFilter.set('name', template.$("#AdminAbsenceProcessed__studentName").val());
    },
    'mouseenter .AdminAbsentees__changeStatus.label-danger': function (event, template) {
        event.currentTarget.innerText = "NOTIFY";
    },
    'mouseleave .AdminAbsentees__changeStatus.label-danger': function (event, template) {
        event.currentTarget.innerText = "MISSING";
    },
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
    },
    'click #AdminAbsentees__update': function () {
        Meteor.call('smartix:absence/processAbsencesForDay', Template.instance().schoolNamespace, undefined, undefined, false, function (err, res) {
            //log.info(err);
            //log.info(res);
        });
    },
    'click #AdminAbsentees__updateNotify': function () {
        Meteor.call('smartix:absence/processAbsencesForDay', Template.instance().schoolNamespace, undefined, undefined, true, function (err, res) {
            //log.info(err);
            //log.info(res);
        });
    }
})
