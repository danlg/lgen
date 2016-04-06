Template.SchoolPick.helpers({
  schools:function(){
      
  },
  getSchoolLogo: function () {
    var logoId = this.logo;
    return Images.findOne(logoId);
  },
  inGlobal:function(){
      if(Roles.userIsInRole(Meteor.userId(),['user'],'global')){
          return true;
      }else{
          return false;
      }
  }
    
});

Template.SchoolPick.events({
    'click .school-card':function(events,template){
       var schoolId = $(events.currentTarget).data("schoolId");  
       console.log('schoolid',schoolId);  
       Session.set('pickedSchoolId',schoolId);
       Router.go('TabClasses');
    }
})