Template.EditSchool.onCreated(function() {

    this.newSchoolLogo = new ReactiveVar("");
    this.newSchoolBackgroundImage = new ReactiveVar("");
    
    var self = this;
    if(Router.current()
    && Router.current().params
    && Router.current().params.school) {

        var schoolUsername = Router.current().params.school;
        self.subscribe('schoolInfo', schoolUsername);
    }
    
    this.subscribe('images');    
});

Template.EditSchool.onDestroyed(function(){
    this.newSchoolLogo = new ReactiveVar("");
});

Template.EditSchool.helpers({
    'existingSchoolLogo':function(){
        return Images.findOne(this.logo);
    },
    'existingSchoolBackgroundImage':function(){
        return Images.findOne(this.backgroundImage);
    },    
    uploadedSchoolLogoId: function() {
        var newSchoolLogoId = Template.instance().newSchoolLogo.get();
        return newSchoolLogoId;
    },
    uploadedSchoolLogo: function() {
        var newSchoolLogoId = Template.instance().newSchoolLogo.get();
        return Images.find(newSchoolLogoId);
    },    
    uploadedSchoolBackgroundImageId: function() {
        var newSchoolLogoId = Template.instance().newSchoolBackgroundImage.get();
        return newSchoolLogoId;
    },
    uploadedSchoolBackgroundImage: function() {
        var newSchoolLogoId = Template.instance().newSchoolBackgroundImage.get();
        return Images.find(newSchoolLogoId);
    },
    getSchoolObj: function(){
            return  SmartixSchoolsCol.findOne({username: Router.current().params.school});            
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
            SmartixSchools.editLogo(files[0], template);
        }
    },
    'change #school-background-image': function(event, template) {
        var files = event.target.files;

        if (files.length > 0) {
            SmartixSchools.editBackgroundImage(files[0], template);
        }
    },    
    'click #edit-school-submit': function(event, template) {
        
        
        var editSchoolObj =
        {
          name: $("#name").val(),
          username: $("#username").val(),
          logo: template.newSchoolLogo.get() || $('existing-school-logo').data('existingSchoolLogoId'), 
          backgroundImage: template.newSchoolBackgroundImage.get() || $('existing-school-background-image').data('existingSchoolBackgroundImageId'), 
          tel: $("#tel").val(),
          web: $("#web").val(),
          email: $("#email").val(),
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



