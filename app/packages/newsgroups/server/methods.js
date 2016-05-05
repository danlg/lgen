Meteor.methods({
    'smartix:newsgroups/createNewsgroup':function(schoolName, newgroupObj){
        
        check(schoolName, String);
        check(newgroupObj, Object);
        
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
            newgroupObj.className,
            newgroupObj.url,
            newgroupObj.mandatory,
            this.userId
        );
            
        if(resultValue === -1){
             throw new Meteor.Error("newsgroups-existed", "Newsgroup already exist");   
        }
    },
    'smartix:newsgroups/joinNewsgroup':function(newsgroupId){
        
       var newsgroup = Smartix.Groups.Collection.findOne(newsgroupId);
       if(newsgroup){
           var userNamespaces = Object.keys(Meteor.user().roles);
           
           if(userNamespaces.indexOf(newsgroup.namespace ) > -1){
            Smartix.Groups.Collection.update(
                {_id: newsgroupId},
                {
                    $addToSet: {users: Meteor.userId()}
                }
            );              
           }else{
            throw new Meteor.Error("group-different-namespace", "Can't join the group in different namespace");               
           }
           
       }else{
        throw new Meteor.Error("class-not-foun", "Can't find the group");           
       }    
        
    }
});