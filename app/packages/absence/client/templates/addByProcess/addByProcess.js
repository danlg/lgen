Template.AttendanceRecordAddByProcess.onCreated(function(){
    
    var self = this;

    self.subscribe('userRelationships', Meteor.userId());
    self.subscribe('mySchools',function(){
       var schoolDoc = SmartixSchoolsCol.findOne({
           username: Router.current().params.school
       });        
      self.subscribe('smartix:absence/parentGetChildProcessed',schoolDoc._id); 
    });       
    self.subscribe('allSchoolUsersPerRole',Router.current().params.school);
    
});

Template.AttendanceRecordAddByProcess.events({

    'click .apply-leave-btn': function () {
        var schoolDoc = SmartixSchoolsCol.findOne({
            username: Router.current().params.school
        });
        var applyLeaveObj = {
            processId: $('#process-id').val(),
            namespace: schoolDoc._id,
            leaveReason: $('#leave-reason').val(),
            startDate: $('#start-date').val(),
            startDateTime: $('#start-date-time').val(),
            endDate: $('#end-date').val(),
            endDateTime: $('#end-date-time').val(),
            studentId: document.getElementById("children-id").value,
            studentName: document.getElementById('children-name').value
        }

        //console.log(applyLeaveObj);


        var transformObj = {
            processId: applyLeaveObj.processId,
            namespace: applyLeaveObj.namespace,
            studentId: applyLeaveObj.studentId,
            reporterId: Meteor.userId(),
            dateFrom: moment(new Date(applyLeaveObj.startDate + " " + applyLeaveObj.startDateTime + " GMT+0800")).unix(),
            eta: moment(new Date(applyLeaveObj.endDate + " " + applyLeaveObj.endDateTime + " GMT+0800")).unix(),
            message: applyLeaveObj.leaveReason,
            startDate: new Date(applyLeaveObj.startDate + " " + applyLeaveObj.startDateTime + " GMT+0800").toLocaleString({},{timeZone:"Asia/Hong_Kong"}),
            endDate: new Date(applyLeaveObj.endDate + " " + applyLeaveObj.endDateTime + " GMT+0800").toLocaleString({},{timeZone:"Asia/Hong_Kong"}),
            studentName: applyLeaveObj.studentName
        }

        //console.log(transformObj);

        if (!transformObj.message) {
            toastr.info('Please fill in reason to leave');
            return;
        }

        IonPopup.show({
            title: TAPi18n.__("ConfirmToApplyLeaveFor") + ": " + transformObj.studentName,
            subTitle: transformObj.startDate +' - '+ transformObj.endDate,
            buttons: [
                {
                    text: TAPi18n.__("Confirm"),
                    type: 'button-assertive',
                    onTap: function () {
                        IonPopup.close();

                        //add record here
                        Meteor.call('smartix:absence/replyWithReason', transformObj, function (err, result) {

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

Template.AttendanceRecordAddByProcess.helpers({
    getProcessObj:function(){       
       return Smartix.Absence.Collections.processed.findOne(Router.current().params.processId);         
    },
    getProcessDate:function(){
        //return wire format, according to RFC3339 spec is yyyy-mm-dd
        //http://stackoverflow.com/questions/7372038/is-there-any-way-to-change-input-type-date-format
        var dateinDB = this.date;
        var dateDayMonthYear = dateinDB.split('-');
        var dateYearMonthDay = dateDayMonthYear[2] + '-' + dateDayMonthYear[1] + '-' + dateDayMonthYear[0];
        return dateYearMonthDay;
    },
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