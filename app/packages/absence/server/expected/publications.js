Meteor.publish({
    'smartix:absence/expectedAbsences': function (namespace) {
        
        check(namespace, String);
        
        if(Smartix.Absence.canViewAllExpectedAbsences(namespace, this.userId)) {
            return Absence.Collections.expected.find({
                namespace: namespace
            });
        } else {
            this.ready();
        }
    },
    'smartix:absence/expectedAbsence': function (id, namespace) {
        
        check(id, String);
        check(namespace, String);
        
        if(Smartix.Absence.canViewExpectedAbsence(id, namespace, this.userId)) {
            return Absence.Collections.expected.find({
                _id: id,
                namespace: namespace
            });
        } else {
            this.ready();
        }
        
    }
});