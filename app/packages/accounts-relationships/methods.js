if(Meteor.isServer){
    
    Meteor.methods({
        'smartix:accounts-relationships/getRelationship':function(id){
            var targetRelationship = Relationships.findOne(id);
            if(!targetRelationship){
                return;
            }
            
            if (
                Meteor.userId == targetRelationship.parent || Meteor.userId == targetRelationship.child ||
                Roles.userIsInRole(Meteor.userId(), 'admin', 'system') ||
                Roles.userIsInRole(Meteor.userId(), 'admin', targetRelationship.namespace) 
            ) {
                return targetRelationship;
            }        
        },       
       'smartix:accounts-relationships/createRelationship':function(options){
           if(options){
               
           }else{
                  throw new Meteor.Error("require-options", "pass an object with parent,child,namespace,type,name to createRelationship");      
           }
           if(
              Roles.userIsInRole(Meteor.userId(),'admin',options.namespace) ||
              Roles.userIsInRole(Meteor.userId(),'admin','system')
           ){
              //console.log('caller is authed');
              
              var parentUserGroups = Roles.getGroupsForUser(options.parent);
              var childUserGroups = Roles.getGroupsForUser(options.child);
              
              //console.log(parentUserGroups);
              //console.log(childUserGroups);
              if(lodash.includes(parentUserGroups,options.namespace) == false){
                  
                  console.log('userId:',options.parent,'does not belong to school:',options.namespace);
                  throw new Meteor.Error("parent-not-belong-to-school", "Parent does not belong to school"+options.namespace);
              }
              
              if(lodash.includes(childUserGroups,options.namespace) == false){
                  console.log('userId:',options.child,'does not belong to school:',options.namespace);
                  throw new Meteor.Error("child-not-belong-to-school", "Child does not belong to school"+options.namespace)
              }
              
              /* uncomment when accounts-schools implemented
              var parentApprovedSchools = Meteor.users.findOne(options.parent).schools;
              if(lodash.includes(parentApprovedSchools,options.namespace == false)){
                  console.log('userId:',options.child,'does not approve to the school:',options.namespace);
                  return;
              }  
              var childApprovedSchools = Meteor.users.findOne(options.child).schools;
              if(lodash.includes(childApprovedSchools,options.namespace == false)){
                  console.log('userId:',options.child,'does not approve to the school:',options.namespace);
                  return;
              }*/     
                       
              if (Relationships.findOne({
                  parent: options.parent,
                  child: options.child,
                  namespace: options.namespace,
              })) {
                  console.log('there is already existing parent-child relationship bewteen this two persons');
                  throw new Meteor.Error("existing-parent-child-relationship", "existing parent-child relationship bewteen this two persons");

              }
              
              
              options.type = options.type.replace(/[0-9]/g, '');
              options.type = options.type.toLowerCase();
              return Relationships.insert({
                  parent: options.parent,
                  child: options.child,
                  namespace: options.namespace,
                  type: options.type,
                  name: options.name
              });  
                                    
           }else{
               console.log('caller is not authed');
               throw new Meteor.Error("caller-not-authed", "caller is not authed");
           }
         
       },
       'smartix:accounts-relationships/editRelationship':function(id,options){
           //to be implemented
       },      
       'smartix:accounts-relationships/removeRelationship':function(id){
           
           if(id){
               
           }else{
             throw new Meteor.Error("required-relationship-id", "pass relationship object or relationship id to remove it");    
           }
              
           var targetRelationship = Relationships.findOne(id);
           if(
              Roles.userIsInRole(Meteor.userId(),'admin',targetRelationship.namespace) ||
              Roles.userIsInRole(Meteor.userId(),'admin','system')
           ){
              Relationships.remove(id);               
           }else{
               console.log('not authed to remove relationship');
               throw new Meteor.Error("caller-not-authed", "caller is not authed");               
           }           

       },           
    });
    
    
}