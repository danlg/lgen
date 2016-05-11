//Get All processed attendance record that needs parent attention
Meteor.publish('smartix:absence/parentGetChildProcessed',function(namespace){
     check(namespace, String);
     var relationRecords = Smartix.Accounts.Relationships.getChildsOfParent(namespace);
     var childIds = lodash.map(relationRecords,'child');
     return Smartix.Absence.Collections.processed.find({studentId:{$in: childIds}});           
});

//Get All Expected attendance record for parent
Meteor.publish('smartix:absence/parentGetChildExpected',function(namespace){
     check(namespace, String);
     console.log('smartix:absence/parentGetChildExpected',namespace);
     var relationRecords = Smartix.Accounts.Relationships.getChildsOfParent(this.userId,namespace);
     console.log('smartix:absence/parentGetChildExpected',relationRecords);     
     var childIds = lodash.map(relationRecords,'child');
     console.log('smartix:absence/parentGetChildExpected',childIds);  
     return Smartix.Absence.Collections.expected.find({studentId:{$in: childIds}});           
});