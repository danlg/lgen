Meteor.methods({
    'smartix:absence/processAbsencesForDay': function (namespace, date, format, notify) {
        return Smartix.Absence.processAbsencesForDay(namespace, date, format, notify, this.userId);
    }
})