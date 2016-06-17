// Template.AddSchool.onCreated(function() {
//     this.newSchoolLogo = new ReactiveVar("");        
//     this.newSchoolBackgroundImage = new ReactiveVar("");           
// });

// Template.AddSchool.helpers({
//     uploadedSchoolLogoId: function() {
//         var newSchoolLogoId = Template.instance().newSchoolLogo.get();
//         return newSchoolLogoId;
//     },
//     uploadedSchoolLogo: function() {
//         var newSchoolLogoId = Template.instance().newSchoolLogo.get();
//         return Images.find(newSchoolLogoId);
//     },
//     uploadedSchoolBackgroundImageId: function() {
//         var newSchoolBackgroundImageId = Template.instance().newSchoolBackgroundImage.get();
//         return newSchoolBackgroundImageId;
//     },
//     uploadedSchoolBackgroundImage: function() {
//         var newSchoolBackgroundImageId = Template.instance().newSchoolBackgroundImage.get();
//         return Images.find(newSchoolBackgroundImageId);
//     }    
// });

// Template.AddSchool.events({
//     'change #school-logo': function(event, template) {
//         var files = event.target.files;
//         if (files.length > 0) {
//             SmartixSchools.editLogo(files[0], template, Router.current().params.school);
//         }
//     },
    
//     'change #school-background-image': function(event, template) {
//         var files = event.target.files;
//         if (files.length > 0) {
//             SmartixSchools.editBackgroundImage(files[0], template, Router.current().params.school);
//         }
//     },    
    
<<<<<<< HEAD
//     'click #edit-school-submit': function(event, template) {
//         var newSchoolObj =
//         { name: $("#name").val(),
//           username: $("#username").val(),
//           adminUsername: $("#admin-username").val(),
//           logo: template.newSchoolLogo.get(),
//           backgroundImage: template.newSchoolBackgroundImage.get(), 
//           tel: $("#tel").val(),
//           web: $("#web").val(),
//           email: $("#email").val(),
//           active: true,
//           preferences: {
//               schoolBackgroundColor: $("#school-background-color").val(),
//               schoolTextColor: $("#school-text-color").val()
//           } 
//         };
//         Meteor.call('smartix:schools/createSchool',newSchoolObj,function(err,result){
//             if(err){
//                 toastr.error(err.reason);
//                 log.error(err);
//             }else{
//                 toastr.info('create school success: you may sign out from system admin to continue');
//                 toastr.info('initial admin:' + result.initialAdmin.username +' pw:' + result.initialAdmin.initialPassword);
//                 log.info(result);
//             }
//         } );
// 'click #edit-school-submit': function(event, template) {
//     var newSchoolObj =
//     { name: $("#name").val(),
//       username: $("#username").val(),
//       adminUsername: $("#admin-username").val(),
//       logo: template.newSchoolLogo.get(),
//       backgroundImage: template.newSchoolBackgroundImage.get(), 
//       tel: $("#tel").val(),
//       web: $("#web").val(),
//       email: $("#email").val(),
//       active: true,
//       preferences: {
//           schoolBackgroundColor: $("#school-background-color").val(),
//           schoolTextColor: $("#school-text-color").val()
//       } 
//     };
//     Meteor.call('smartix:schools/createSchool',newSchoolObj,function(err,result){
//         if(err){
//             toastr.error(err.reason);
//             log.error(err);
//         }else{
//             toastr.info('create school success: you may sign out from system admin to continue');
//             toastr.info('initial admin:' + result.initialAdmin.username +' pw:' + result.initialAdmin.initialPassword);
//             log.info("smartix:schools/createSchool",result);
//         }
//     } );

//     },
    
//     'click .signOut': function () {
//         log.info("logout:" + Meteor.userId());
//         Meteor.logout(
//         function (err) {
//             //remove all session variables when logout
//             Session.clear();
//             Router.go('LoginSplash');
//         }
//         );
//   }
// });



