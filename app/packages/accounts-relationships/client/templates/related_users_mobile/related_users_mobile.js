Template.RelatedUsersMobile.onCreated(  function () {
    //WARNING this template is used both on the mobile for the user or on the admin part
    //watch out change that could adversely break one or the other
    var schoolId = UI._globalHelpers['getCurrentSchoolId']();
    //here depends whether the user is the admin (ROuter uid ) or the actual user viewing  "myaccount"
    let userId = Router.current().params.uid ?  Router.current().params.uid : Meteor.userId();

    //to get the "relationships"
    this.subscribe('userRelationshipsInNamespace',userId, schoolId);
    
    //to get the "users"
    this.subscribe('usersFromRelationships', userId);
});

Template.RelatedUsersMobile.helpers({

    //TODO ignore orphan relationship
    relationships:function(){
        let relationship = Smartix.Accounts.Relationships.Collection.find();
        //log.info("relationship", relationship.fetch());
        return relationship;
    },

    getFirstAndLastNameById: function(userid){
        var usr =  Meteor.users.findOne(userid);
        if(usr) {
            return usr.profile.firstName + " " + usr.profile.lastName;
        }
        else {
            log.error ("getFirstAndLastNameById, cannot find user", userid);
        }
    },

    userIsChild:function(){
        let userId = Router.current().params.uid ?  Router.current().params.uid : Meteor.userId();
        var isChild = (this.child ===  userId);
        //log.info("userIsChild:"+ userId + "=" +  isChild);
        return isChild;
    },

    userIsParent:function(){
        let userId = Router.current().params.uid ?  Router.current().params.uid : Meteor.userId();
        var isParent = (this.parent ===  userId);
        //log.info("userIsParent:"+ userId + "=" + isParent);
        return isParent;
    }

    // userIsChildOrParent:function(userid){
    //   return ( Template.RelatedUsersMobile.__helpers.get('userIsParent').call() )
    //      ||  ( Template.RelatedUsersMobile.__helpers.get('userIsChild').call() );
    // },
    // relationshipName:function() {
    //     //Mother, Father,...so can be translated
    //     return TAPi18n.__(this.name);
    // }

    // user: (uid) => {
    //     return   Meteor.users.findOne( { "_id": uid });
    // },

    // getRelationshipId:function(){
    //     log.info("getUserId",  this._id);
    //     return this._id;
    // },

    // users: ()=>{
    //user relationship
    //    return Meteor.users.find();
    //     log.info("calling child helper");
    //     log("relationship child", Template.instance().relationship.get());
    //     log("relationship child", Template.instance().relationship.get());
    // },
    //  child:() => {
    //      log.info("getChild (from relationship",  this);
    //      return this.child;
    //  },
    // parent:() => {
    //     log.info("getParent (from relationship",  this);
    //     return this.parent;
    // },
});

Template.RelatedUsersMobile.events({
    'click .remove-relationship-btn': function (e) {
        var relationshipId = $(e.target).data("relationshipId");
        Meteor.call('smartix:accounts-relationships/removeRelationship',relationshipId);
    }
});