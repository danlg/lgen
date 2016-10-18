Meteor.publish('smartix:absence/expectedAbsences', function (namespace) {
    check(namespace, String);
    if(Smartix.Absence.canViewAllExpectedAbsences(namespace, this.userId)) {
        let cursor = Smartix.Absence.Collections.expected.find({
            namespace: namespace
        });
        // log.info('smartix:absence/expectedAbsences', cursor.count());
        return cursor;
    } else {
        this.ready();
    }
});

Meteor.publish('smartix:absence/expectedAbsence', function (id, namespace) {
    check(id, String);
    check(namespace, String);
    if(Smartix.Absence.canViewExpectedAbsence(id, namespace, this.userId)) {
        return Smartix.Absence.Collections.expected.find({
            _id: id,
            namespace: namespace
        });
    } else {
        this.ready();
    }
});

Meteor.publish('smartix:absence/expectedAbsencesUsers', function (namespace, dateFrom, dateTo) {
    check(namespace, String);
    // Not yet implemented
    check(dateFrom, Match.Maybe(Number));
    check(dateTo, Match.Maybe(Number));
    if(Smartix.Absence.canViewAllExpectedAbsences(namespace, this.userId)) {
        let allExpectedAbsencesCursor = Smartix.Absence.Collections.expected.aggregate([
            { $match: { namespace: namespace } },
            { $group: { _id: "$studentId"    } }
        ]);
        //aggregate return  _id, not studentId !
        //see https://docs.mongodb.com/manual/reference/method/db.collection.aggregate/
        let studentsArray = [];
        allExpectedAbsencesCursor.forEach(function (expectedRecord) {
            //studentsArray.push(val._id);
            // log.info("smartix:absence/expectedAbsencesUsers expectedRecord", expectedRecord);
            studentsArray.push(expectedRecord._id);
        });
        //log.info("studentsArray", studentsArray);
	    let find = Meteor.users.find({
            _id:     { $in: studentsArray },
            // studentId: { $in: studentsArray },
            //schools:   { $elemMatch :  { namespace } }
            schools:   { $elemMatch :  {$in : [namespace ] } }
        });
        // log.info("smartix:absence/expectedAbsencesUsers studentsArray",studentsArray);
        // log.info("smartix:absence/expectedAbsencesUsers namespace", namespace);
        // log.info("smartix:absence/expectedAbsencesUsers", find.count());
        // log.info("smartix:absence/expectedAbsencesUsers", find.fetch());
        return find;
    } else {
        this.ready();
    }
});