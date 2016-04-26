Template.EditSchool.created = function() {

    this.newSchoolLogo = new ReactiveVar("");
}

Template.EditSchool.helpers({
    uploadedSchoolLogoId: function() {
        var newSchoolLogoId = Template.instance().newSchoolLogo.get();
        return newSchoolLogoId;
    },
    uploadedSchoolLogo: function() {
        var newSchoolLogoId = Template.instance().newSchoolLogo.get();
        return Images.find(newSchoolLogoId);
    }
});

Template.EditSchool.events({
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
          logo: template.newSchoolLogo.get(), 
          tel: $("#tel").val(),
          web: $("#web").val(),
          email: $("#email").val(),
          active: true,
          preferences: {} 
        };
        
        
        Meteor.call('smartix:schools/createSchool',newSchoolObj,function(err,result){
            if(err){
                console.log(err);
            }else{
                console.log(result);
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



