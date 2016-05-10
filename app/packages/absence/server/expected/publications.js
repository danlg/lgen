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

Meteor.publish('smartix:absence/expectedAbsencesUsers', function (namespace, from, to) {
    
    check(namespace, String);
    
    // Not yet implemented
    check(from, Match.Maybe(Number));
    check(to, Match.Maybe(Number));
    
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