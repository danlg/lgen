Template.MessageDetail.helpers({
  getImage: function () {
    var id = this.toString();
    return Images.findOne(id);
  },
  isNewMessage:function(sendAt){   
     var result = Notifications.findOne({'eventType':'newclassmessage','messageCreateTimestampUnixTime':sendAt});       
     //backward comptability
     if(!result){
         return "";
     }  
     if(result.hasRead == false){
         return 'ion-record';
     }else{
         return "";
     }
  },
  getSound: function () {
    var id = this.toString();
    return Sounds.findOne(id);
  },
  haveDocument: function () {
    //existing message may not have documentArr attribute
    if(this.documentArr){
        return this.documentArr.length > 0;
    }else{
        return false;
    }
  },
  getDocument: function () {
    var id = this.toString();
    return Documents.findOne(id);
  },
  haveSound: function () {
    return this.soundArr.length > 0;
  },
  isNotEmpty: function (action) {
    return action.length > 0;
  },
  isSelectAction: function (action) {
    //return "";
    return lodash.includes(lodash.map(action, "_id"), Meteor.userId()) ? "colored" : "";
  },
  getNameById: function (userId) {
    var userObj = Meteor.users.findOne(userId);
    return userObj._id == Meteor.userId() ? "You" : userObj.profile.firstName + " " + userObj.profile.lastName;
  }
});