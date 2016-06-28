Meteor.publish('smartix:absence/expectedAbsences', function (namespace) {
    check(namespace, String);
    if(Smartix.Absence.canViewAllExpectedAbsences(namespace, this.userId)) {
        return Smartix.Absence.Collections.expected.find({
            namespace: namespace
        });
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
        let agRes = Smartix.Absence.Collections.expected.aggregate([
            {
                $match: {
                    namespace: namespace
                }
            },
            {
                $group: {
                    _id: "$studentId"
                }
            }
        ]);
        
        let studentsArray = [];
        
        agRes.forEach(function (val) {
            studentsArray.push(val._id);
        });
        
        return Meteor.users.find({
            _id: {
                $in: studentsArray
            }
        });
    } else {
        this.ready();
    }
});