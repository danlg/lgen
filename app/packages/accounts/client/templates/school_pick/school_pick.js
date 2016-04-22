Template.SchoolPick.helpers({
  schools:function(){
      //approved schools == schools at Meteor.user().roles AND at Meteor.user().schools                
      var approvedSchools = Meteor.user().schools;
      
      console.log('approvedSchools',approvedSchools);
      if(approvedSchools){
         return SmartixSchoolsCol.find({_id:{$in: approvedSchools} });          
      }
      
  },
  pendingSchools:function(){
      //pending schools == schools at Meteor.user().roles BUT NOT at Meteor.user().schools
      if(Meteor.user().roles){
        var allShools = Object.keys(Meteor.user().roles);
        var approvedSchools = Meteor.user().schools;
        
        //the seconds parameter is the schools to exclude
        var pendingSchools =  lodash.difference(allShools,approvedSchools);
        
        console.log('pendingSchools',pendingSchools);
        if(pendingSchools){
            return SmartixSchoolsCol.find({_id:{$in: pendingSchools} });                
        }              
      }


  },  
  getSchoolLogo: function () {
    var logoId = this.logo;
    return Images.findOne(logoId);
  },
  inGlobal:function(){
      if(Roles.userIsInRole(Meteor.userId(),['user'],'global')
         || Roles.userIsInRole(Meteor.userId(),['admin'],'global')){
          return true;
      }else{
          return false;
      }
  }
    
});

Template.SchoolPick.events({
    'click .school-card':function(events,template){
       var schoolId = $(events.currentTarget).data("schoolId");
       var isApproved = $(events.currentTarget).data("schoolApproved");
       
       if(!isApproved){
            Meteor.call('smartix:accounts-schools/approveSchool',schoolId);    
       }
       console.log('schoolid',schoolId);  
       Session.set('pickedSchoolId',schoolId);
       Router.go('TabClasses');
    }
})