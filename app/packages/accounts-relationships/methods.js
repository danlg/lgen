if(Meteor.isServer){
    
    Meteor.methods({
       
       'smartix:accounts-relationships/createRelationship':function(options){
         
           if(
              Roles.userIsInRole(Meteor.userId(),'admin',options.namespace) ||
              Roles.userIsInRole(Meteor.userId(),'admin','system')
           ){
               
              if(lodash.find(Roles.getGroupsForUser(options.from),function(grp){grp == options.namespace}) &&
                 lodash.find(Roles.getGroupsForUser(options.to),function(grp){grp == options.namespace})
                ){
                   options.type = options.type.replace(/[0-9]/g, '');
                   options.type = options.type.toLowerCase();
                   Relationships.insert({
                                          from: options.from,
                                          to: options.to,
                                          namespace: options.namespace,
                                          type: options.type,
                                          name: options.name
                                        });  
                }
                          
           } 
         
       },
       'smartix:accounts-relationships/editRelationship':function(id,options){
           
       },      
       'smartix:accounts-relationships/removeRelationship':function(options){
           if(
              Roles.userIsInRole(Meteor.userId(),'admin',options.namespace) ||
              Roles.userIsInRole(Meteor.userId(),'admin','system')
           ){
              Relationships.remove({ from: options.from, to: options.to, namespace: options.namespace,type: options.type, name: options.name });               
           }           

       },           
    });
    
    
}