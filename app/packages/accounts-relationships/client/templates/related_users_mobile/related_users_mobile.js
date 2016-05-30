Template.RelatedUsersMobile.helpers({
   relationships:function(){
     return Smartix.Accounts.Relationships.Collection.find();
   },
   getFirstAndLastNameById: function(userid){
       var usr =  Meteor.users.findOne(userid);
       if(usr) {
           return usr.profile.firstName + " " + usr.profile.lastName;
       }
   },
   userIsChild:function(){
       //var isChild = (this.child ===  Router.current().params.uid);
       //log.info("userIsChild:"+ Router.current().params.uid + "=" +  isChild);
       return (this.child === Router.current().params.uid);
   },

   userIsParent:function(){
       //var isParent = (this.parent ===  Router.current().params.uid);
       //log.info("userIsParent:"+ Router.current().params.uid + "=" + isParent);
       return (this.parent === Router.current().params.uid);
   }

   // userIsChildOrParent:function(userid){
   //   return ( Template.RelatedUsersMobile.__helpers.get('userIsParent').call() )
   //      ||  ( Template.RelatedUsersMobile.__helpers.get('userIsChild').call() );
   // },
   // relationshipName:function() {
   //     //Mother, Father,...so can be translated
   //     return TAPi18n.__(this.name);
   // }
});

Template.RelatedUsersMobile.events({
  'click .remove-relationship-btn': function (e) {
    var relationshipId = $(e.target).data("relationshipId");
    Meteor.call('smartix:accounts-relationships/removeRelationship',relationshipId);
  }
});