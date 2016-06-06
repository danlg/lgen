//Get All processed attendance record that needs parent attention
Meteor.publish('smartix:absence/parentGetChildProcessed',function(namespace){
     check(namespace, String);
     var relationRecords = Smartix.Accounts.Relationships.getChildsOfParent(this.userId,namespace);
     var childIds = lodash.map(relationRecords,'child');
     return Smartix.Absence.Collections.processed.find({studentId:{$in: childIds}});           
});

//Get All Expected attendance record for parent
Meteor.publish('smartix:absence/parentGetChildExpected',function(namespace){
     check(namespace, String);
     //log.info('smartix:absence/parentGetChildExpected',namespace);
     var relationRecords = Smartix.Accounts.Relationships.getChildsOfParent(this.userId,namespace);
     //log.info('smartix:absence/parentGetChildExpected',relationRecords);     
     var childIds = lodash.map(relationRecords,'child');
     //log.info('smartix:absence/parentGetChildExpected',childIds);  
     return Smartix.Absence.Collections.expected.find({studentId:{$in: childIds}});           
});