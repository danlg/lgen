Meteor.methods({
    'smartix:newsgroups/createNewsgroup':function(schoolName, newgroupObj, distributionLists){
        check(schoolName, String);
        check(newgroupObj, Object);
        var schoolDoc = SmartixSchoolsCol.findOne({
            shortname: schoolName
        });
        if(!schoolDoc) {
            throw new Meteor.Error("school-not-exist", "The school with name " + schoolName + " does not exist.")
        }
        
        var distributionListInputCount = distributionLists.length;
        var distributionListCount      = Smartix.Groups.Collection.find({_id: {$in: distributionLists}, type:'distributionList'}).count();
        if(distributionListInputCount !== distributionListCount){
             throw new Meteor.Error("distributionList-invalid", "Some distribution lists are not valid");             
        }
        
        
        var resultValue = Smartix.Newsgroup.createNewsgroup(
            distributionLists,
            [],
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
            throw new Meteor.Error("group-different-namespace", "Can't join the group in different school");
           }
           
       }else{
        throw new Meteor.Error("class-not-foun", "Can't find the group");           
       }    
        
    },
    'smartix:newsgroups/addToOptOutList':function(newsgroupId){
       // log.info("smartix:newsgroups/addToOptOutList", newsgroupId);
       var newsgroup = Smartix.Groups.Collection.findOne(newsgroupId);
       if(newsgroup){
           var userNamespaces = Object.keys(Meteor.user().roles);
           if(userNamespaces.indexOf(newsgroup.namespace ) > -1){
            Smartix.Groups.Collection.update(
                {_id: newsgroupId},
                {
                    $addToSet: {optOutUsersFromDistributionLists: Meteor.userId()}
                }
            );              
           }else{
            throw new Meteor.Error("group-different-namespace", "Can't join the group in different school");
           }
           
       }else{
        throw new Meteor.Error("class-not-foun", "Can't find the group");           
       } 
               
    },    
    'smartix:newsgroups/removeFromOptOutList':function(newsgroupId){
        //log.info("smartix:newsgroups/removeFromOptOutList", newsgroupId);
        var newsgroup = Smartix.Groups.Collection.findOne(newsgroupId);
       if(newsgroup){
           var userNamespaces = Object.keys(Meteor.user().roles);
           if(userNamespaces.indexOf(newsgroup.namespace ) > -1){
            Smartix.Groups.Collection.update(
                {_id: newsgroupId},
                {
                    $pull: {optOutUsersFromDistributionLists: Meteor.userId()}
                }
            );              
           }else{
            throw new Meteor.Error("group-different-namespace", "Can't join the group in different school");
           }
       }else{
        throw new Meteor.Error("class-not-foun", "Can't find the group");           
       } 
    },    
    'smartix:newsgroups/deleteNewsgroup':function(newsgroupId){
        Smartix.Newsgroup.deleteNewsgroup(newsgroupId, Meteor.userId());
    },
    'smartix:newsgroups/deleteNewsgroups':function(newsgroupIds){
        Smartix.Newsgroup.deleteNewsgroups(newsgroupIds, Meteor.userId());
    },    
    'smartix:newsgroups/addDistributionListToGroup':Smartix.Newsgroup.addDistributionListToGroup,
    'smartix:newsgroups/removeDistributionListToGroup':Smartix.Newsgroup.removeDistributionListToGroup
    
});