import base64 from 'blob-util'

Template.SignupMain.onCreated(function(){
    this.chosenRole = new ReactiveVar('');
    this.chosenNumberOfStudent = new ReactiveVar(0);
    this.mySchoolName = new ReactiveVar('');

    this.defaultColor = '#3E82F7';
    this.inputBackgroundColor = new ReactiveVar(this.defaultColor);
    this.inputTextColor = new ReactiveVar('#FFFFFF');
    this.currentSchoolFormTemplate = new ReactiveVar('SchoolSignupForm');
    this.newSchoolId = new ReactiveVar('');
    this.previewSchoolLogoBlob = new ReactiveVar('');
    this.previewSchoolBackgroundImageBlob = new ReactiveVar('');

    //from EmailSignup template merged below
    //$("body").removeClass('modal-open');
    if (Meteor.userId()) {
        Smartix.helpers.routeToTabClasses();
    }
});

Template.SignupMain.onRendered(function()
{
    loadDefaultImage(this);
});

Template.SignupMain.helpers({
    emailSignup: function(argument) {
        Schema.emailSignup.i18n("schemas.emailSignup");
        return Schema.emailSignup;
    },
    getCurrentSchoolFormTemplate:function(){
        return Template.instance().currentSchoolFormTemplate.get();
    },
    mySchoolName:function(){
        return Template.instance().mySchoolName.get();
    },
    mySchoolNameForSimulatedScreen:function(){
        if( Template.instance().mySchoolName.get() === '' ){
            return TAPi18n.__("My_remarkable_school");
        }else{
            return Template.instance().mySchoolName.get();
        }
    },
    getInputBackgroundColor : function(){
        return Template.instance().inputBackgroundColor.get();
    },
    customizeTheme:function(){
        var schoolBackgroundColor = Template.instance().inputBackgroundColor.get();
        var schoolTextColor       = Template.instance().inputTextColor.get();
        //log.info(schoolBackgroundColor);//,schoolTextColor);
        var customStyle = `
            
        <style>
                #example-forms-floating-labels .bar.bar-positive, .bar.bar-positive, .bar.bar-stable,
                .button.button-positive.active, .button.button-positive {
                    border-color: ${schoolBackgroundColor};
                    transition: background-color 0.1s ease,  border-color 0.1s ease;
                    background-color: ${schoolBackgroundColor};
                    background-image: linear-gradient(0deg, ${schoolBackgroundColor}, ${schoolBackgroundColor} 50%, transparent 50%);
                    color: ${schoolTextColor};
                }
                
                .bar.bar-stable .title, .bar-stable .button.button-clear{
                  color: ${schoolTextColor};
                }
                
                .card.square-card .mask{
                    transition: background-color 0.1s ease;
                    background-color: ${schoolBackgroundColor}; 
                }
                
                .device-preview-backdrop {
                    transition: background-color 0.1s ease;
                    background-color: ${schoolBackgroundColor};                         
                }
                                        
            </style>
        `;
        return customStyle;
    },
});

Template.SignupMain.events({
    'keyup .school-name':function(event,template){
        template.mySchoolName.set(     $(event.target).val()  );
    },

    'click .role-selection':function(event,template){
        //$(event.target).data('role');
        $(".role-selection").removeClass('chosen-role');
        $(event.currentTarget).addClass('chosen-role');
        template.chosenRole.set($(event.currentTarget).data('role'));
    },

    'click .number-of-student-selection':function(event,template){
        //$(event.target).data('role');
        $(".number-of-student-selection").removeClass('chosen-number-of-student');
        $(event.currentTarget).addClass('chosen-number-of-student');
        template.chosenNumberOfStudent.set($(event.currentTarget).data('number'));
    },

    'click .start-my-trial-btn':function(event,template){
        var school = {};
        school.schoolFullName        = template.mySchoolName.get();
        school.schoolCountry         = $('#school-country').val();
        school.schoolCity            = $('#school-city').val();
        school.schoolNumberOfStudent = $('#school-number-of-student').val();
        school.schoolBackgroundColor = template.inputBackgroundColor.get();
        school.schoolTextColor       =template.inputTextColor.get();

        var user = {};
        user.userFirstName         = $('#user-first-name').val();
        user.userLastName          = $('#user-last-name').val();
        user.userEmail             = $('#user-email').val();
        user.userPosition          = $('#user-position').val();

        var lead = {
            firstName: user.userFirstName,
            lastName:  user.userLastName,
            position:  user.userPosition,
            stage: "page-1",
            email:user.userEmail,
            howManyStudents: school.schoolNumberOfStudent
        };
        var schoolTrialAccountCreationObj = {school: school, user: user};
        //http://stackoverflow.com/questions/11866910/how-to-force-a-html5-form-validation-without-submitting-it-via-jquery
        if($('#school-trial-account-create')[0].checkValidity()){
            //checkValidity without form submission
            event.preventDefault();
            Session.set('schoolTrialAccountCreation', schoolTrialAccountCreationObj);
            //log.info('start-my-trial-btn');
            Meteor.call('smartix:schools/createSchoolTrial',
                {
                    fullname : school.schoolFullName ,
                    logo : '',
                    tel  : '',
                    web  : '',
                    email: user.userEmail,
                    country: school.schoolCountry ,
                    city:    school.schoolCity,
                    preferences:{
                        schoolBackgroundColor: school.schoolBackgroundColor,
                        schoolTextColor:       school.schoolTextColor
                    },
                    lead: lead
                },
                function(err,result){
                    if(result){
                        log.info('newSchoolId',result);
                        template.newSchoolId.set(result);
                        template.currentSchoolFormTemplate.set('SchoolSignupForm2');
                    }else{
                        log.error('Failed to create school',school.schoolFullName);
                    }
                });
        }
        else{
            var userAgent = window.navigator.userAgent;
            if( userAgent.match(/Safari/i)  && !userAgent.match(/Chrome/i) ){
                event.preventDefault();
            }
            toastr.error(TAPi18n.__("requiredFields"));
            $('#school-trial-account-create').addClass('invalid');
            //log.warn('Form incomplete');
        }
    },

    'click .start-my-trial-page2-btn':function(event,template){
        if ($('#school-trial-account-create-page2')[0].checkValidity()) {
            //checkValidity without form submission
            event.preventDefault();
            var schoolShortName = $('#school-short-name').val();
            schoolShortName = schoolShortName.split(' ').join('').toLowerCase();
            var schoolTrialAccountCreationObj = Session.get('schoolTrialAccountCreation');
            var logoId  = createImage (template.previewSchoolLogoBlob.get(), schoolShortName);
            var bgImageId = createImage (template.previewSchoolBackgroundImageBlob.get(), schoolShortName);
            Meteor.call('smartix:schools/editSchoolTrial',
                template.newSchoolId.get(),
                {
                    shortname: schoolShortName,
                    lead: {
                        stage: 'page-2',
                        howDidYourFind: $('textarea#how-did-you-find').val(),
                        whichIssues: $('textarea#which-issues').val(),
                        HowSmartixExpect: $('textarea#how-smartix-expect').val()
                    },
                    logo: logoId || "",
                    backgroundImage: bgImageId || ""
                },
                {
                    email: schoolTrialAccountCreationObj.user.userEmail,
                    firstName: schoolTrialAccountCreationObj.user.userFirstName,
                    lastName: schoolTrialAccountCreationObj.user.userLastName
                },                
                function (err,result) {
                    if(err){
                        if(err.error === 'short-name-taken'){
                            toastr.error(TAPi18n.__("PersonalDomainTaken"))
                        }
                        if(err.error === 'short-name-invalid')
                        {
                            toastr.error(TAPi18n.__("PersonalDomainInvalid"))
                        }
                    }else{
                        toastr.info(
                            TAPi18n.__("EmailSentTo") +schoolTrialAccountCreationObj.user.userEmail +
                            '. ' + TAPi18n.__("EmailToFinishRegistration"));
                        Router.go('LoginSplash');
                    }
                });
        }
        else{
            var userAgent = window.navigator.userAgent;
            if( userAgent.match(/Safari/i)  && !userAgent.match(/Chrome/i) ){
                event.preventDefault();
            }
            toastr.error(TAPi18n.__("requiredFields")+" "+TAPi18n.__("PersonalDomainInvalid"));
            $('#school-trial-account-create-page2').addClass('invalid');
        }
    },

    'change #school-background-color-picker-polyfill': function (event, template) {
        //log.info("change color set ", $(event.target).val());
        template.inputBackgroundColor.set($(event.target).val());
    },

    'click .reset-color-and-logos':function(event, template) {
        //log.info("reset-color was", $(event.target).val());
        //log.info("reset-color set", template.defaultColor);
        template.inputBackgroundColor.set(template.defaultColor);
        template.inputTextColor.set('#FFFFFF');
        document.getElementById("school-logo-preview").src = '/img/icon-hd-email.png';
        document.getElementById("school-banner-preview").src = '/img/graduation_ceremony_picture@1x.jpg';
        loadDefaultImage(Template.instance());
        //need to reset palette
        event.preventDefault();
        $('#school-background-color-picker-polyfill').spectrum({
            color: template.defaultColor,
            preferredFormat: "hex",
            showInput: true,
            showPalette: true,
            palette: [[
                "darkred", "lightgreen", "lightblue", "gold", "forestgreen", "purple", "orange", "pink", "mediumturquoise"]],
            showButtons: false
        });
    } ,

    'change #school-logo': function (event, template) {
        var files = event.target.files;
        if (files.length > 0) {
            var reader = new FileReader();
            reader.onload = function (readerEvent) {
                //log.info(readerEvent);
                // get loaded data and render thumbnail.
                document.getElementById("school-logo-preview").src = readerEvent.currentTarget.result;
                template.previewSchoolLogoBlob.set( readerEvent.currentTarget.result );
            };
            // read the image file as a data URL.
            reader.readAsDataURL(files[0]);
        }
    },

    'change #school-background-image': function (event, template) {
        var files = event.target.files;
        if (files.length > 0) {
            var reader = new FileReader();
            reader.onload = function (readerEvent) {
                //log.info(readerEvent);
                // get loaded data and render thumbnail.
                document.getElementById("school-banner-preview").src = readerEvent.currentTarget.result;
                template.previewSchoolBackgroundImageBlob.set( readerEvent.currentTarget.result );
            };
            // read the image file as a data URL.
            reader.readAsDataURL(files[0]);
        }
    },

    'click .individual-create-btn': function(event, template) {
        var userObj = {};
        userObj.profile = {};
        var email = $(".email").val();
        var password = $(".password").val();
        if(password.length < 4) {
           toastr.error(TAPi18n.__("PasswordNotEnoughLength"));
        }
        userObj.password = password;
        userObj.profile.firstName = $(".fn").val();
        userObj.profile.lastName = $(".ln").val();
        userObj.dob = $("#dobInput").val() || "";
        if (!Smartix.helpers.validateEmail(email)) {
            toastr.error(TAPi18n.__("EmailNotFound"));
        } else {
            Meteor.call('smartix:accounts/createUser', email, userObj, 'global', ['user'], function(err, res) {
                if (err) {
                    toastr.error(err.reason);
                    log.error(err);
                } else {
                    //create User successfully
                    analytics.track("Sign Up", {
                        date: new Date(),
                        email: userObj.email,
                        verified: false
                    });
                    Meteor.loginWithPassword(email,password,function(err){
                        if(err){
                            toastr.error(TAPi18n.__("EmailTaken"));
                        }else{
                            toastr.info(TAPi18n.__("WelcomeVerification"));
                            log.info("login:meteor:" + Meteor.userId());
                            Smartix.helpers.routeToTabClasses();                            
                        }
                    });
                }
            });
        }
    },
    
    'click .individual-google-login-btn':function(event, template) {
        Smartix.Accounts.registerOrLoginWithGoogle();
    }     ,

    //below individual signup
    'click .createBtn': function(event, template) {
        var userObj = {};
        userObj.profile = {};
        var email = $(".email").val();
        var password = $(".password").val();
        if(password.length < 4) {
           toastr.error(TAPi18n.__("PasswordNotEnoughLength"));
        }
        userObj.password = password;
        userObj.profile.firstName = $(".fn").val();
        userObj.profile.lastName = $(".ln").val();
        //userObj.dob = $("#dobInput").val() || "";
        if (!Smartix.helpers.validateEmail(email)) {
            toastr.error(TAPi18n.__("EmailFormatNotCorrect"));
        } else {
            Meteor.call('smartix:accounts/createUser', email, userObj, 'global', ['user'], function(err, res) {
                if (err) {
                    toastr.error(err.reason);
                    log.error(err);
                } else {
                    //create User successfully
                    analytics.track("Sign Up", {
                        date: new Date(),
                        email: userObj.email,
                        verified: false
                    });
                    Meteor.loginWithPassword(email,password,function(err){
                        if(err){
                            toastr.error(TAPi18n.__("EmailTaken"));
                        }else{
                            toastr.info(TAPi18n.__("WelcomeVerification"));
                            log.info("login:meteor:" + Meteor.userId());
                            Smartix.helpers.routeToTabClasses();
                        }
                    });
                }

            });
        }
    },

    'click .google-login-btn':function(event, template) {
        Smartix.Accounts.registerOrLoginWithGoogle();
    },

    'click #person-sign-up':function(event,template){
        event.preventDefault();
        log.info("click #person-sign-up");
        template.currentSchoolFormTemplate.set('IndividualSignUp');
    },
    //if we are on individual signup we go to school signup
    'click #school-sign-up':function(event,template){
        event.preventDefault();
        log.info("click #school-sign-up");
        template.currentSchoolFormTemplate.set('SchoolSignupForm');

    }
});

function hasHtml5Validation () {
    return typeof document.createElement('input').checkValidity === 'function';
}

var createImage = function(imagesData, shortname) {
    let imageObj;
    let imageObjId ;
    if(imagesData){
        var newFile = new FS.File(imagesData);
        newFile.metadata = {'id': shortname, 'category': 'school', 'school': shortname};
        imageObj = Images.insert(newFile);
        imageObjId = imageObj._id;
        return imageObjId;
    }
};


//This method loads the base64 URL of the default images into the reactiveVars
var loadDefaultImage = function(template)
{
    var schoolLogoSource = document.getElementById("school-logo-preview").src;;
    var schoolbannerSource = document.getElementById("school-banner-preview").src;
    var schoolBackground = base64.imgSrcToDataURL(schoolLogoSource,  {crossOrigin: 'Anonymous'}).then(function (dataURL) {
        template.previewSchoolLogoBlob.set(dataURL);
    }).catch(function (err) {
        log.info(err);
    });  

    var schoolBackground = base64.imgSrcToDataURL(schoolbannerSource, 'image/jpeg', {crossOrigin: 'Anonymous'}).then(function (dataURL) {
        template.previewSchoolBackgroundImageBlob.set(dataURL);
        // log.info(schoolbannerSource, dataURL);
    }).catch(function (err) {
        log.info(err);
    });  
}