//publish specific user's relationships
Meteor.publish('userRelationships', function(userId) {
    
  if(userId == this.userId || Roles.userIsInRole(this.userId,'admin','system'))
  //return relationships belong to the current user, as a parent or as a child
  return Relationships.find({ $or: [ { parent: userId }, { child: userId } ] }); 
});

//publish users' relationships in a namespace for admin usage
Meteor.publish('userRelationshipsInNamespace', function(namespace) {
    
  if(Roles.userIsInRole(this.userId,'admin',namespace) ||
   Roles.userIsInRole(this.userId,'admin','system')
  ){
   return Relationships.find({ namespace: namespace }); 
  }
});

