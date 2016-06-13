Template.SignupMain.onCreated(function(){
    this.chosenRole = new ReactiveVar('');
    this.chosenNumberOfStudent = new ReactiveVar(0);
    this.mySchoolName = new ReactiveVar('');

    this.defaultColor = '#0080BF';
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

Template.SignupMain.onRendered(function(){
    //log.info('SchoolSignupForm',this.inputBackgroundColor);
    $('#school-background-color-picker-polyfill').spectrum({
        color: this.inputBackgroundColor.get(),
        preferredFormat: "hex",
        showInput: true,
        showPalette: true,
        //palette: [["#3F5D7D","#279B61" ,"#008AB8","#993333","#A3E496","#95CAE4","#CC3333","#FFCC33","#CC6699"]],
        palette: [[
            "darkred", "lightgreen", "lightblue", "gold", "forestgreen", "purple", "orange", "pink", "mediumturquoise"]],
        showButtons: false
    });
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

    getSchoolLogoBackground:function(){
        var customStyle;
        //log.info('schoolBackgroundImageId',schoolBackgroundImageId);
        //log.info(schoolLogoId);
        if( Template.instance().previewSchoolBackgroundImageBlob.get() ){
            customStyle = `
                                <style>                        
                                    .mobile-school-home-fake .school-banner-wrapper .school-banner-background{
                                    background-image: url('${Template.instance().previewSchoolBackgroundImageBlob.get()}');
                                    }                                                                    
                                </style>
                            `;
        }else{
            customStyle = `
                                <style>                        
                                    .mobile-school-home-fake .school-banner-wrapper .school-banner-background{
                                    background-image: url('/packages/smartix_accounts/client/asset/graduation_ceremony_picture@1x.jpg');
                                    }                                                                    
                                </style>
                            `;
        }
        return customStyle;
    }
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
        //TODO: really pass data to page 2 , form input checking
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
        //log.info('school',school);
        //log.info('user',user);
        //log.info('lead',lead);
        var SchoolTrialAccountCreationObj = {school: school, user: user};
        //http://stackoverflow.com/questions/11866910/how-to-force-a-html5-form-validation-without-submitting-it-via-jquery
        if($('#school-trial-account-create')[0].checkValidity()){
            //checkValidity without form submission
            event.preventDefault();
            Session.set('schoolTrialAccountCreation',SchoolTrialAccountCreationObj);
            log.info('start-my-trial-btn');
            Meteor.call('smartix:schools/createSchoolTrial',
                {
                    name : school.schoolFullName ,
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
                template.previewSchoolLogoBlob.get(),
                template.previewSchoolBackgroundImageBlob.get(),
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
            toastr.info('Please complete the form');
            $('#school-trial-account-create').addClass('invalid');
            //log.warn('Form incomplete');
        }
    },

    'click .start-my-trial-page2-btn':function(event,template){
        if ($('#school-trial-account-create-page2')[0].checkValidity()) {
            //checkValidity without form submission
            event.preventDefault();
            var schoolShortName = $('#school-short-name').val();
            var SchoolTrialAccountCreationObj = Session.get('schoolTrialAccountCreation');
            //log.info('start-my-trial-page2-btn', SchoolTrialAccountCreationObj);
            //update school shortname from  template.newSchoolId.get()
            Meteor.call('smartix:schools/editSchoolTrial',
                template.newSchoolId.get(),
                {
                    username: schoolShortName,
                    lead: {
                        stage: 'page-2',
                        howDidYourFind: $('textarea#how-did-you-find').val(),
                        whichIssues: $('textarea#which-issues').val(),
                        HowSmartixExpect: $('textarea#how-smartix-expect').val()
                    }
                },
                {
                    email: SchoolTrialAccountCreationObj.user.userEmail,
                    firstName: SchoolTrialAccountCreationObj.user.userFirstName,
                    lastName: SchoolTrialAccountCreationObj.user.userLastName
                },
                function (err,result) {
                    if(err){
                        if(err.error === 'short-name-taken'){
                            toastr.info('school domain name has been taken. Please choose another one.')
                        }
                    }else{
                        toastr.info(
                            'We have sent you an email to ' +SchoolTrialAccountCreationObj.user.userEmail +
                            '. Open it to finish registration (please check also your Spam folder).');
                        Router.go('LoginSplash');
                    }
                });
        }
        else{
            var userAgent = window.navigator.userAgent;
            if( userAgent.match(/Safari/i)  && !userAgent.match(/Chrome/i) ){
                event.preventDefault();
            }
            toastr.info('Please complete the form');
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
        template.previewSchoolLogoBlob.set('');
        template.previewSchoolBackgroundImageBlob.set('');
        document.getElementById("school-logo-preview").src = '/packages/smartix_accounts/client/asset/hbs_logo.svg';
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
                //document.getElementById("school-background-image-preview").src = readerEvent.currentTarget.result;
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
           toastr.error("At least 4 characters Password");
        }
        userObj.password = password;
        userObj.profile.firstName = $(".fn").val();
        userObj.profile.lastName = $(".ln").val();
        userObj.dob = $("#dobInput").val() || "";
        if (!Smartix.helpers.validateEmail(email)) {
            toastr.error("Incorrect Email");
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
                            toastr.error('Sign up fail. The email is already taken');
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
            toastr.error("At least 4 characters Password");
        }
        userObj.password = password;
        userObj.profile.firstName = $(".fn").val();
        userObj.profile.lastName = $(".ln").val();
        //userObj.dob = $("#dobInput").val() || "";
        if (!Smartix.helpers.validateEmail(email)) {
            toastr.error("Incorrect Email");
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
                            toastr.error('Sign up fail. The email is already taken');
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