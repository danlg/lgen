if(Meteor.isServer){
    
    Meteor.methods({
       
       'smartix:accounts-relationships/createRelationship':function(options){
         
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
                  console.log('userId:',options.parent,'does not belong to group:',options.namespace);
                  return;
              }
              
              if(lodash.includes(childUserGroups,options.namespace) == false){
                  console.log('userId:',options.child,'does not belong to group:',options.namespace);
                  return;
              }
              
              if (Relationships.findOne({
                  parent: options.parent,
                  child: options.child,
                  namespace: options.namespace,
              })) {
                  console.log('there is already existing parent-child relationship bewteen this two persons');
                  return;
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
               return;
           }
         
       },
       'smartix:accounts-relationships/editRelationship':function(id,options){
           //to be implemented
       },      
       'smartix:accounts-relationships/removeRelationship':function(id){
           
           var targetRelationship = Relationships.findOne(id);
           if(
              Roles.userIsInRole(Meteor.userId(),'admin',targetRelationship.namespace) ||
              Roles.userIsInRole(Meteor.userId(),'admin','system')
           ){
              Relationships.remove(id);               
           }else{
               console.log('not authed to remove relationship');
           }           

       },           
    });
    
    
}