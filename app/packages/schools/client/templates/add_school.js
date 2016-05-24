Template.AddSchool.onCreated(function() {

    this.newSchoolLogo = new ReactiveVar("");        
});

Template.AddSchool.helpers({
    uploadedSchoolLogoId: function() {
        var newSchoolLogoId = Template.instance().newSchoolLogo.get();
        return newSchoolLogoId;
    },
    uploadedSchoolLogo: function() {
        var newSchoolLogoId = Template.instance().newSchoolLogo.get();
        return Images.find(newSchoolLogoId);
    }
});

Template.AddSchool.events({
    'change #school-logo': function(event, template) {
        var files = event.target.files;

        if (files.length > 0) {
            SmartixSchools.editLogo(files[0], template);
        }
    },
    'click #edit-school-submit': function(event, template) {
        
        
        var newSchoolObj =
        { name: $("#name").val(),
          username: $("#username").val(),
          adminUsername: $("#admin-username").val(),
          logo: template.newSchoolLogo.get(), 
          tel: $("#tel").val(),
          web: $("#web").val(),
          email: $("#email").val(),
          active: true,
          preferences: {
              schoolBackgroundColor: $("#school-background-color").val(),
              schoolTextColor: $("#school-text-color").val()
          },
          allowStudentStudentChat:  document.getElementById("student-to-student-chat").checked
          
        };
        
        
        Meteor.call('smartix:schools/createSchool',newSchoolObj,function(err,result){
            if(err){
                toastr.error(err.reason);
                log.info(err);
            }else{
                toastr.info('create school success: you may sign out from system admin to continue');
                toastr.info('initial admin:' + result.initialAdmin.username +' pw:' + result.initialAdmin.initialPassword);
                log.info(result);
            }
        } );

    },'click .signOut': function () {
        log.info("logout:" + Meteor.userId());
        Meteor.logout(
        function (err) {
            //remove all session variables when logout
            Session.clear();
            Router.go('LoginSplash');
        }
        );
  }
});



