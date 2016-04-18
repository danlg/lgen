Meteor.methods({
    
    'smartix:newsgroups/createNewsgroup':function(schoolName, classObj){
        
        var schoolDoc = SmartixSchoolsCol.findOne({
            username: schoolName
        });
        
        classObj.namespace = schoolDoc._id;

        //TODO. instead of find out all users of this school, allow user to specific users in the school by some sort of querying
        //find out all users of this school
        var userIds = Meteor.users.find({schools:schoolDoc._id}, {fields: {_id: 1}}).fetch();
       
        //console.log(userIds);
        
        //console.log(classObj);
        var resultValue = Smartix.Newsgroup.createNewsgroup( lodash.map(userIds,'_id') , classObj.namespace, classObj.name, classObj.url)        
        if(resultValue == -1){
             throw new Meteor.Error("newsgroups-existed", "Newsgroup already exist");   
        }
    }
});