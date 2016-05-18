Template.AttendanceRecordAdd.onCreated(function(){
    
    var self = this;

    self.subscribe('userRelationships', Meteor.userId());
    self.subscribe('mySchools');    
    self.subscribe('allSchoolUsersPerRole',Router.current().params.school);
    
});

Template.AttendanceRecordAdd.events({

    'click .apply-leave-btn': function () {
        var schoolDoc = SmartixSchoolsCol.findOne({
            username: Router.current().params.school
        });
        var applyLeaveObj = {
            namespace: schoolDoc._id,
            leaveReason: $('#leave-reason').val(),
            startDate: $('#start-date').val(),
            startDateTime: $('#start-date-time').val(),
            endDate: $('#end-date').val(),
            endDateTime: $('#end-date-time').val(),
            studentId: document.getElementById("children-id").value,
            studentName: document.getElementById('children-id').selectedOptions[0].text
        };

        //console.log(applyLeaveObj);
        var transformObj = {
            namespace: applyLeaveObj.namespace,
            studentId: applyLeaveObj.studentId,
            reporterId: Meteor.userId(),
            dateFrom: moment(applyLeaveObj.startDate + " " + applyLeaveObj.startDateTime + "+0800").unix(),
            dateTo: moment(applyLeaveObj.endDate + " " + applyLeaveObj.endDateTime + "+0800").unix(),
            message: applyLeaveObj.leaveReason,
            startDate: moment(applyLeaveObj.startDate + " " + applyLeaveObj.startDateTime + "+0800").format("LLLL"),
            endDate: moment(applyLeaveObj.endDate + " " + applyLeaveObj.endDateTime + "+0800").format("LLLL"),
            studentName: applyLeaveObj.studentName
        };

        //console.log(transformObj);
        if (transformObj.dateFrom > transformObj.dateTo) {
            toastr.info('Leave start date needs to be earlier than Leave end date');
            return;
        }

        if (!transformObj.message) {
            toastr.info('Please fill in reason to leave');
            return;
        }

        IonPopup.show({
            title: TAPi18n.__("absence.ConfirmToApplyLeaveFor") + " for " + transformObj.studentName,
            subTitle: "From " + transformObj.startDate + '\nTo ' + transformObj.endDate,
            buttons: [
                {
                    text: TAPi18n.__("Confirm"),
                    type: 'button-assertive',
                    onTap: function () {
                        IonPopup.close();

                        //add record here
                        Meteor.call('smartix:absence/registerExpectedAbsence', transformObj, function (err, result) {

                            if (err) {
                                toastr.error('Apply Leave fails');
                                log.info(err);
                            } else {
                                toastr.info('Apply Leave Success');
                                $('#leave-reason').val("");
                            }


                        });
                    }
                },
                {
                    text: TAPi18n.__("Cancel"), type: 'button',
                    onTap: function () {
                        IonPopup.close();
                    }
                }
            ]
        });




    }

});

Template.AttendanceRecordAdd.helpers({
    getTodayDate : function(){
        var date = new Date();
        var formattedDate = moment(date).format('YYYY-MM-DD');
        return formattedDate;
    },
    getCurrentTime : function(){
        var date = new Date();
        var formattedTime = moment(date).format('HH:mm');
        return formattedTime;
    },
    getDefaultStartDateTime:function(){
      return "08:00";  
    },
    getDefaultEndDateTime:function(){
      return "17:00"
    },
    getAllChildrens:function(){

        var schoolDoc = SmartixSchoolsCol.findOne({
            username: Router.current().params.school
        });
            
        var childs = [];
        var findChilds = Smartix.Accounts.Relationships.Collection.find({ parent: Meteor.userId(), namespace: schoolDoc._id }).fetch();
        //console.log('findParents', findParents);
        findChilds.map(function (relationship) {
            childs.push(relationship.child);
        });
        
        return childs;     
    },
    getUserById: function(userId) {
        var targetUserObj = Meteor.users.findOne(userId);
        return targetUserObj;
    }
})