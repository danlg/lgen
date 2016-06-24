Template.EditSchool.onCreated(function() {
    this.newSchoolLogo = new ReactiveVar("");
    this.newSchoolBackgroundImage = new ReactiveVar("");
    var schoolName = UI._globalHelpers['getCurrentSchoolName']();
    if(schoolName)
    {
        this.subscribe('schoolInfo', schoolName);
        this.subscribe('images', schoolName, 'school', schoolName);
    }

});

Template.EditSchool.onDestroyed(function(){
    // this.newSchoolLogo = new ReactiveVar("");
});

Template.EditSchool.onRendered(function(){
    var schoolId = SmartixSchoolsCol.findOne();
    if(schoolId.logo)
        Template.instance().newSchoolLogo.set(Images.findOne(schoolId.logo)._id);
    if(schoolId.backgroundImage)
        Template.instance().newSchoolBackgroundImage.set(Images.findOne(schoolId.backgroundImage)._id); 
});

Template.EditSchool.helpers({ 
    uploadedSchoolLogo: function() {
        var newSchoolLogoId = Template.instance().newSchoolLogo.get();
        return Images.find(newSchoolLogoId);
    },    
    uploadedSchoolBackgroundImage: function() {
        var newSchoolLogoId = Template.instance().newSchoolBackgroundImage.get();
        return Images.find(newSchoolLogoId);
    },
    getSchoolObj: function(){
        return  SmartixSchoolsCol.findOne();
    },
    isStudentToStudentChatAllow:function(){
        if(this.allowStudentStudentChat){
           return 'checked'; 
        }else{
           return "";
        }
    }
});

Template.EditSchool.events({
    'change #school-logo': function(event, template) {
        var files = event.target.files;
        if (files.length > 0) {
            editImage(files[0], template, UI._globalHelpers['getCurrentSchoolName'](), template.newSchoolLogo);
        }
    },

    'change #school-background-image': function(event, template) {
        var files = event.target.files;
        if (files.length > 0) {
            editImage(files[0], template, UI._globalHelpers['getCurrentSchoolName'](), template.newSchoolBackgroundImage);
        }
    },    

    'click #edit-school-submit': function(event, template) {
        var editSchoolObj =
        {
          name: $("#name").val(),
          shortname: $("#shortname").val(),
          logo: template.newSchoolLogo.get() || $('existing-school-logo').data('existingSchoolLogoId'), 
          backgroundImage: template.newSchoolBackgroundImage.get() || $('existing-school-background-image').data('existingSchoolBackgroundImageId'), 
          tel: $("#tel").val(),
          web: $("#web").val(),
          email: $("#email").val(),
          contactemail: $("#contactemail").val(),
          preferences: {
              schoolBackgroundColor: $("#school-background-color").val(),
              schoolTextColor: $("#school-text-color").val()
          }
        };
        //log.info('editSchoolObj',editSchoolObj);
        Meteor.call('smartix:schools/editSchool',$("#school-id").val(),editSchoolObj,function(err,result){
            if(err){
                toastr.error(err.reason);
                log.info(err);
            }else{
                toastr.info('School information has been updated.');
            }
        } );

    }
});

var editImage = function(filePath,template, schoolUserName, image) {
    var newFile = new FS.File(filePath);
    newFile.metadata = {id: schoolUserName, category: 'school', school: schoolUserName};
    Images.insert(newFile, function(err, fileObj) {
        if (err) log.error(err);
        else {
            if(template && image){
                image.set(fileObj._id);
            }                  
        }
    });
};