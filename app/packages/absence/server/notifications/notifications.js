Smartix = Smartix || {};

Smartix.Absence = Smartix.Absence || {};

//Notification from admin to parent to ask for student attendance detail
Smartix.Absence.notificationToParentForDetail = function (processId, currentUserId) {

    check(processId, String);
    check(currentUserId, String);

    var currentUser = Meteor.users.findOne(currentUserId);

    var processObj = Smartix.Absence.Collections.processed.findOne(processId);
    

    // Get the parents
    let parents = Smartix.Accounts.Relationships.getParentOfStudent(processObj.studentId, processObj.namespace);
    let parentIds = _.map(parents, function (parent) {
        return parent._id;
    });
    
    console.log(parentIds);

    parentIds.forEach(function (parentId) {
        //1. add to notification obj
        Notifications.insert({
            eventType: 'attendance',
            eventSubType:'attendanceToParent',
            userId: parentId,
            hasRead: false,
            processId: processId,
            namespace: processObj.namespace,
            messageCreateTimestamp: message.createdAt,
            messageCreateByUserId: Meteor.userId()
        });

        //2. send push and in-app notification                  
        var notificationObj = {
            from: Smartix.helpers.getFullNameByProfileObj(currentUser.profile),
            title: 'TBD We need more detail about your children attendance',
            text: 'TBD We need more detail about your children attendance',
            payload: {
                type: 'attendance',
                subType:'attendanceToParent',
                id: processId
            },
            query: { userId: parentId },
            badge: Smartix.helpers.getTotalUnreadNotificationCount(parentId)
        };
        Meteor.call("doPushNotification", notificationObj);
    });
    
    // Update the records of last notified
    Smartix.Absence.Collections.processed.update({
        _id: processId
    }, {
        $set: {
            lastNotified: Math.floor(Date.now() / 1000)
        } 
    });
}

//Notification from admin to parent to display approval of leave application
Smartix.Absence.notificationToParentApprovedNotice = function (expectedId, currentUserId) {

    check(expectedId, String);
    check(currentUserId, String);

    var currentUser = Meteor.users.findOne(currentUserId);

    var expectedObj = Smartix.Absence.Collections.expected.findOne(expectedId);
    
    // Get the parents
    let parents = Smartix.Accounts.Relationships.getParentOfStudent(expectedObj.studentId, expectedObj.namespace);
    let parentIds = _.map(parents, function (parent) {
        return parent._id;
    });
    
    parentIds.forEach(function (parentId) {
        //1. add to notification obj
        Notifications.insert({
            eventType: 'attendance',
            eventSubType: 'attendanceApproved',
            userId: parentId,
            hasRead: false,
            expectedId: expectedId,
            namespace: expectedObj.namespace,
            messageCreateTimestamp: new Date(),
            messageCreateByUserId: Meteor.userId()
        });

        //2. send push and in-app notification              
        var notificationObj = {
            from: Smartix.helpers.getFullNameByProfileObj(currentUser.profile),
            title: 'TBD We have approved your leave application',
            text: 'TBD We have approved your leave application',
            payload: {
                type: 'attendance',
                subType: 'attendanceApproved',
                id: expectedId
            },
            query: { userId: parentId },
            badge: Smartix.helpers.getTotalUnreadNotificationCount(parentId)
        };
        Meteor.call("doPushNotification", notificationObj);
    });

}

//Notification from parent to admin about request of leave application
Smartix.Absence.notificationToAdminApprovalRequest = function (expectedId, currentUserId) {

    check(expectedId, String);
    check(currentUserId, String);

    var currentUser = Meteor.users.findOne(currentUserId);
    var expectedObj = Smartix.Absence.Collections.expected.findOne(expectedId);
    //console.log('Smartix.Absence.notificationToAdminApprovalRequest',expectedObj);
    // Get all admins
    var admins = Roles.getUsersInRole('admin', expectedObj.namespace).fetch();
    //console.log('Smartix.Absence.notificationToAdminApprovalRequest:admins',admins);
    var adminIds = lodash.map(admins,'_id');
    
    adminIds.forEach(function (adminId) {

        //1. add to notification obj
        Notifications.insert({
            eventType: 'attendance',
            eventSubType:'attendanceSubmission',
            userId: adminId,
            hasRead: false,
            expectedId: expectedId,
            namespace: expectedObj.namespace,
            messageCreateTimestamp: new Date(),
            messageCreateByUserId: Meteor.userId()
        });

        //2. send push and in-app notification   

        var notificationObj = {
            from: Smartix.helpers.getFullNameByProfileObj(currentUser.profile),
            title: 'TBD A Parent has submitted a leave application',
            text: 'TBD A Parent has submitted a leave application',
            payload: {
                type: 'attendance',
                subType:'attendanceSubmission',
                id: expectedId,
                namespace: expectedObj.namespace,
            },
            query: { userId: adminId },
            badge: Smartix.helpers.getTotalUnreadNotificationCount(adminId)
        };
        Meteor.call("doPushNotification", notificationObj);
    });

}

//Notification from parent to admin about response from parent of student attendance    
Smartix.Absence.notificationToAdminForDetailReply = function (processId, currentUserId) {

    check(processId, String);
    check(currentUserId, String);

    var currentUser = Meteor.users.findOne(currentUserId);

    var processObj = Smartix.Absence.Collections.processed.findOne(processId);


    // Get all admins
    var admins = Roles.getUsersInRole('admin', processObj.namespace);
    var adminIds = _.map(admins, function (admin) {
        return admin._id;
    });

    adminIds.forEach(function (adminId) {
        //1. add to notification obj
        Notifications.insert({
            eventType: 'attendance',
            eventSubType:'attendanceToAdmin',
            userId: adminId,
            hasRead: false,
            processId: processId,
            namespace: processObj.namespace,
            messageCreateTimestamp: message.createdAt,
            messageCreateByUserId: Meteor.userId()
        });

        //2. send push and in-app notification 

        var notificationObj = {
            from: Smartix.helpers.getFullNameByProfileObj(currentUser.profile),
            title: 'Parent has replied about children attendance',
            text: 'Parent has replied about children attendance',
            payload: {
                type: 'attendance',
                subType:'attendanceToAdmin',
                id: processId
            },
            query: { userId: adminId },
            badge: Smartix.helpers.getTotalUnreadNotificationCount(adminId)
        };
        Meteor.call("doPushNotification", notificationObj);
    });

}