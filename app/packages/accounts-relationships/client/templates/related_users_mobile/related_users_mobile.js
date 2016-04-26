Template.RelatedUsersMobile.helpers({
   relationships:function(){
     return Smartix.Accounts.Relationships.Collection.find();
   },
   getParentNameById:function(userid){
       var usr =  Meteor.users.findOne(userid);
       return usr.profile.firstName + " " + usr.profile.lastName;
   },
   getChildNameById:function(userid){
       var usr =  Meteor.users.findOne(userid);
       return usr.profile.firstName + " " + usr.profile.lastName;       
   },
   userIsChild:function(userid){
       if(Meteor.userId() == userid ){
           return true;
       }else{
           return false;
       }
   },
   userIsParent:function(userid){
       if(Meteor.userId() == userid ){
           return true;
       }else{
           return false;
       }
   },
   userIsChildOrParent:function(){
       if(this.child ==Meteor.userId() || this.parent == Meteor.userId()){
           return true;
       }else{
           return false;
       }
   }
});

Template.RelatedUsersMobile.events({
  'click .remove-relationship-btn': function (e) {
    var relationshipId = $(e.target).data("relationshipId");
   
    Meteor.call('smartix:accounts-relationships/removeRelationship',relationshipId);

  }
});