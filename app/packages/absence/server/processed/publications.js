Meteor.publish('smartix:absence/allAbsences', function (namespace) {
    check(namespace, String);
    
    if(Smartix.Absence.canViewAllExpectedAbsences(namespace, this.userId)) {
        return Smartix.Absence.Collections.processed.find({
            namespace: namespace
        });
    } else {
        this.ready();
    }
})

Meteor.publish('smartix:absence/absentUsers', function (namespace) {
    
    check(namespace, String);
    
    if(Smartix.Absence.canViewAllExpectedAbsences(namespace, this.userId)) {
        let agRes = Smartix.Absence.Collections.processed.aggregate([
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