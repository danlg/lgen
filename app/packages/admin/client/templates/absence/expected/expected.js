Template.AdminAbsenceExpected.onCreated(function () {
    // subscribe to the school info first
    var schoolName = UI._globalHelpers['getCurrentSchoolName']();
    var self = this;
    this.subscribe('schoolInfo', schoolName, function () {
        var schoolId = UI._globalHelpers['getCurrentSchoolId']();
        if(schoolId) {
            self.subscribe('smartix:absence/expectedAbsences', schoolId, function () {
                self.subscribe('smartix:absence/expectedAbsencesUsers', schoolId);
            });
        } else {
            log.error("Could not find school with code " + schoolName);
        }
    });
    // Set defaults for the filter
    this.expectedAbsencesFilter = new ReactiveDict();
    this.expectedAbsencesFilter.set('from', moment(Date.now()).format("YYYY-MM-DD"));
    this.expectedAbsencesFilter.set('to', moment(Date.now()).add(1, 'day').format("YYYY-MM-DD"));
    this.expectedAbsencesFilter.set('status', "any");
    this.expectedAbsencesFilter.set('name', undefined);
});

Template.AdminAbsenceExpected.helpers({
    filterStartDate: function () {
        return Template.instance().expectedAbsencesFilter.get('from');
    },
    filterEndDate: function () {
        return Template.instance().expectedAbsencesFilter.get('to');
    },
    expectedAbsence: function () {
        var dateFrom = Template.instance().expectedAbsencesFilter.get('from');
        var dateTo = Template.instance().expectedAbsencesFilter.get('to');
        
        // Assumes UTC+8
        var dateFromTS = moment.utc(dateFrom, "YYYY-MM-DD").startOf('day').subtract(8, 'hours').unix();
        var dateToTS = moment.utc(dateTo, "YYYY-MM-DD").endOf('day').subtract(8, 'hours').unix();
        
        var status = Template.instance().expectedAbsencesFilter.get('status');
        var name = Template.instance().expectedAbsencesFilter.get('name');
        
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
        
        if(status === "any") {
            status = {$exists: true};
        } else if (status === "approved") {
            status = true;
        } else {
            status = false
        }
        
        return Smartix.Absence.Collections.expected.find({
            studentId: studentIdSelector,
            dateFrom: {
                $lte: dateToTS
            },
            dateTo: {
                $gte: dateFromTS
            },
            approved: status,
            namespace: UI._globalHelpers['getCurrentSchoolId']()
        });
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
    },
    'click #AdminAbsenceExpected__updateFilter': function (event, template) {
        Template.instance().expectedAbsencesFilter.set('from', template.$('#AdminAbsenceExpected__startDate').eq(0).val());
        Template.instance().expectedAbsencesFilter.set('to', template.$('#AdminAbsenceExpected__endDate').eq(0).val());
        Template.instance().expectedAbsencesFilter.set('status', template.$("input[name='status-filter']:checked").val());
        Template.instance().expectedAbsencesFilter.set('name', template.$("#AdminAbsenceExpected__studentName").val());
    }
})