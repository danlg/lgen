Meteor.methods({
    'smartix:newsgroups/createNewsgroup':function(schoolName, classObj){
        
        check(schoolName, String);
        check(classObj, Object);
        
        var schoolDoc = SmartixSchoolsCol.findOne({
            username: schoolName
        });
        
        if(!schoolDoc) {
            throw new Meteor.Error("school-not-exist", "The school with name " + schoolName + " does not exist.")
        }
        
        // TODO. Instead of retrieving all users of this school
        // allow user to specific users in the school by some sort of querying
        
        // Find out all users of this school
        
        var userIds = Meteor.users.find({
            schools:schoolDoc._id
        }, {
            fields: {
                _id: 1
            }
        }).fetch();
       
        var resultValue = Smartix.Newsgroup.createNewsgroup(
            lodash.map(userIds, '_id'),
            schoolDoc._id,
            classObj.className,
            classObj.url,
            this.userId);
            
        if(resultValue === -1){
             throw new Meteor.Error("newsgroups-existed", "Newsgroup already exist");   
        }
    }
});