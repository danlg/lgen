Template.MessageDetail.helpers({
  attachImages: function () {
    var imageObjects =lodash.filter(this.addons, function(addon) { return addon.type =='images'; });
    return lodash.map(imageObjects,'fileId');
  },  
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
  attachVoices: function () {
    var voiceObjects =lodash.filter(this.addons, function(addon) { return addon.type =='voice'; });
    return lodash.map(voiceObjects,'fileId');
  },  
  getSound: function () {
    var id = this.toString();
    return Sounds.findOne(id);
  },
  attachDocuments: function () {
    var docObjs =lodash.filter(this.addons, function(addon) { return addon.type =='documents'; });
    return lodash.map(docObjs,'fileId');
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
  },
  attachCalendar:function(){
    var calendarObjs =lodash.filter(this.addons, function(addon) { return addon.type =='calendar'; });
    return calendarObjs;       
  }
});