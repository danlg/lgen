Meteor.methods({

    'smartix:schools/getSchoolName': function(schoolName) {
        if(schoolName === 'global'){
            Roles.userIsInRole(Meteor.userId(), 'user', 'global');
            return 'global';
        }
        log.info('smartix:schools/getSchoolName', schoolName);
        if(schoolName === 'sysadmin'){
            //we have to set a school
            Roles.userIsInRole(Meteor.userId(), 'sysadmin');
            return 'global';
        }
        var targetSchool = SmartixSchoolsCol.findOne(schoolName);
        if (
            Roles.userIsInRole(Meteor.userId(), Smartix.Accounts.School.SYSADMIN, schoolName) ||
            Roles.userIsInRole(Meteor.userId(), Smartix.Accounts.School.ADMIN, schoolName)||
            Roles.userIsInRole(Meteor.userId(), Smartix.Accounts.School.PARENT, schoolName)||
            Roles.userIsInRole(Meteor.userId(), Smartix.Accounts.School.STUDENT, schoolName)||
            Roles.userIsInRole(Meteor.userId(), Smartix.Accounts.School.TEACHER, schoolName)
        ) {
            return targetSchool.shortname;
        }
    },      
    
    'smartix:schools/getSchoolInfo': function(id) {
        var targetSchool = SmartixSchoolsCol.findOne(id);
        if (
            Roles.userIsInRole(Meteor.userId(), 'sysadmin') ||
            Roles.userIsInRole(Meteor.userId(), 'admin', id)
        ) {
            return targetSchool;
        }
    },
    
    'smartix:schools/createSchoolTrial':function(options){
        if (options) {
            options.createdAt = new Date();
            //TEMP: hardcode expired date = today + 30 days
            options.planTrialExpiryDate = new Date();
            options.planTrialExpiryDate.setDate( options.planTrialExpiryDate.getDate() + 30);
        } else {
            throw new Meteor.Error("require-options", "Pass School Object to create a school");
        }
        SchoolsSchema.clean(options);
        check(options, SchoolsSchema);
        var schoolId;
        // checks that schoolname is not taken ! implemented in schema, unique
        try {
            schoolId = SmartixSchoolsCol.insert({
                fullname: options.fullname,
                logo:  "",
                backgroundImage:  "",
                country: options.country,
                city:    options.city,
                tel: options.tel,
                web: options.web,
                email: options.email,
                active: true,
                preferences: {
                    schoolBackgroundColor:options.preferences.schoolBackgroundColor,
                    schoolTextColor:options.preferences.schoolTextColor
                },
                createdAt: options.createdAt,
                planTrialExpiryDate: options.planTrialExpiryDate,
                revenueToDate: options.revenueToDate,
                revenueToDateCcy: options.revenueToDateCcy,
                lead: options.lead || {}
            });
        } catch (err) {
            log.error(err.message);
            throw err;
        }
        if(options.lead){
            Meteor.defer(function(){
                Email.send(
                    { 
                        from: Meteor.settings.FROM_EMAIL,
                        to:   Meteor.settings.FEEDBACK_EMAIL,
                        subject : 'new lead' + options.lead.firstName + ' ' + options.lead.lastName,
                        html: JSON.stringify(options)
                    
                    }
                );
            });
            log.info("New lead from", options.lead.firstName + ' ' + options.lead.lastName, "to", Meteor.settings.FEEDBACK_EMAIL);
        }
        else{
            lor.error("Cannot send new lead email");
        }
        return schoolId;
    },
    
    //Save Logo and Background Image, Creates schoolShortname
    'smartix:schools/editSchoolTrial': function (id, schoolOptions,userOptions) {
        //log.info('smartix:schools/editSchoolTrial',id);
        var targetSchool = SmartixSchoolsCol.findOne(id);
        //only if the school is totally new, it can be updated by anonymous
        if (targetSchool.shortname) {
            log.error('caller is not authed');
            throw new Meteor.Error("caller-not-authed", "caller is not authed");
        }
        var existingSchoolWithSameShortName = SmartixSchoolsCol.findOne({shortname: schoolOptions.shortname});
        if(existingSchoolWithSameShortName){
            log.warn('School short name has been taken:'+ targetSchool.shortname);
            throw new Meteor.Error("short-name-taken", "school short name has been taken. Pick another one");            
        } 
        //log.info('raw',targetSchool);
        // https://github.com/aldeed/meteor-simple-schema/issues/387
        
        //upload background and logo, update schoolOptions to add logo and background ids
        // var imgObject = createImage(imagesData, backgroundImagesData, schoolOptions.username);
        // schoolOptions.logo = imgObject.logoId || "";
        // schoolOptions.backgroundImage = imgObject.bgImageId || "";     
        
        delete targetSchool._id;
        lodash.merge(targetSchool, schoolOptions);
        //log.info('afterMerge',targetSchool);        
        SchoolsSchema.clean(targetSchool);
        check(targetSchool, SchoolsSchema);
        //log.info('afterClean',targetSchool);
        //return 1 if update success
        var updateCount = SmartixSchoolsCol.update(id, { $set: targetSchool });
        if(updateCount === 1){
            //create school admin account for user, send enrolment email                
            Meteor.call('smartix:accounts-schools/createSchoolUser',
                userOptions.email,
                {
                    username: Smartix.Accounts.helpers.generateUniqueUserName (userOptions.firstName, userOptions.lastName),
                    profile: {
                        firstName: userOptions.firstName,
                        lastName: userOptions.lastName
                    }
                },
                id,
                ['admin'],
                false,//autoverify
                true//notify watchout side effect
             );
                       
        }
    },

    // 'smartix:schools/createSchool': function(options, admins) {
    //     log.info("smartix:schools/createSchool", options, admins);
    //     /*
    //     Meteor.call('smartix:schools/createSchool',{name:'Shau Kei Wan - Elsa High',username:'elsahighadmin',logo:'1234567',tel:'36655388',web:'http://www.carmel.edu.hk/',email:'elsahighschool@carmel.edu.hk.test',active:true,preferences:{}});
    //     */
    //     if (options) {
    //         options.createdAt = new Date();
    //         options.planTrialExpiryDate = new Date();
    //         options.planTrialExpiryDate.setDate( options.planTrialExpiryDate.getDate() + 30);
    //     } else {
    //         throw new Meteor.Error("require-options", "Pass School Object to create a school");
    //     }
    //     if (Roles.userIsInRole(Meteor.userId(), 'admin', 'system')) {
    //         var adminUsername = options.adminUsername || options.username;
    //         delete options.adminUsername;
            
    //         SchoolsSchema.clean(options);
    //         check(options, SchoolsSchema);
                     
    //         if (lodash.includes(RESERVED_SCHOOL_NAMES, options.username)) {
    //             log.error(CANNOT_BE_SAME_AS_RESERVED_NAMES);
    //             return;
    //         }
    //         var schoolId;   
    //         //TODO: logo pass upload image id
    //         var existingSchool = SmartixSchoolsCol.findOne({username:options.username});
    //         if(existingSchool){
    //             log.error('school short name has been taken');     
    //             throw new Meteor.Error("short-name-taken", "school short name has been taken");                
    //         }
    //         // checks that schoolname is not taken ! implemented in schema, unique
    //         try {
    //             schoolId = SmartixSchoolsCol.insert({
    //                 name: options.name,
    //                 username: options.username,
    //                 // logo: options.logo,
    //                 // backgroundImage: options.backgroundImage,
    //                 tel: options.tel,
    //                 web: options.web,
    //                 email: options.email,
    //                 active: true,
    //                 preferences: {
    //                     schoolBackgroundColor:options.preferences.schoolBackgroundColor,
    //                     schoolTextColor:options.preferences.schoolTextColor
    //                 },
    //                 createdAt: options.createdAt,
    //                 planTrialExpiryDate: options.planTrialExpiryDate,
    //                 revenueToDate: options.revenueToDate,
    //                 revenueToDateCcy: options.revenueToDateCcy
    //             });
    //         } catch (err) {
    //             throw err;
    //         }
    //         var newAdmin = adminUsername;
    //         var newAdminPassword = "admin";
    //         if (admins) {
    //             admins.map(function(eachAdmin) {
    //                 Roles.addUsersToRoles(eachAdmin, 'admin', schoolId);
    //             });
    //             return { school: schoolId };
    //         } else {
    //             Meteor.call('smartix:accounts-schools/createSchoolUser',
    //                 options.email,
    //                 {
    //                     username: newAdmin,
    //                     password: newAdminPassword,
    //                     profile: {
    //                         firstName: newAdmin,
    //                         lastName: ""
    //                     }
    //                 },
    //                 schoolId,
    //                 ['admin'],
    //                 true, //autoverify
    //                 false //notify
    //              );
    //             return { school: schoolId, initialAdmin: { username: newAdmin, initialPassword: newAdminPassword } };
    //         }
    //     } else {
    //         log.info('caller is not authed');
    //         throw new Meteor.Error("caller-not-authed", "caller is not authed");
    //     }
    // },

    'smartix:schools/editSchool': function(id, options) {

        var targetSchool = SmartixSchoolsCol.findOne(id);
        //log.info('raw',targetSchool);
        if (
            Roles.userIsInRole(Meteor.userId(), 'sysadmin') ||
            Roles.userIsInRole(Meteor.userId(), 'admin', id)
        ) {
            // https://github.com/aldeed/meteor-simple-schema/issues/387
            delete targetSchool._id;      
            lodash.merge(targetSchool, options);
            //log.info('afterMerge',targetSchool);        
            SchoolsSchema.clean(targetSchool);              
            check(targetSchool, SchoolsSchema);             
            //log.info('afterClean',targetSchool);           
            //return 1 if update success
            return SmartixSchoolsCol.update(id, {$set: targetSchool });

        } else {
            log.info('caller is not authed');
            throw new Meteor.Error("caller-not-authed", "caller is not authed");
        }
    }
});



