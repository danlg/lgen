Meteor.methods({
    'smartix:schools/getSchoolName': function(id) {
        if(id === 'global'){
            Roles.userIsInRole(Meteor.userId(), 'user', 'global');
            return 'global';
        }
        if(id === 'system'){
            Roles.userIsInRole(Meteor.userId(), 'admin', 'system');
            return 'system';
        }               
        var targetSchool = SmartixSchoolsCol.findOne(id);
            
        if (
            Roles.userIsInRole(Meteor.userId(), 'admin', 'system') ||
            Roles.userIsInRole(Meteor.userId(), Smartix.Accounts.School.ADMIN, id)||
            Roles.userIsInRole(Meteor.userId(), Smartix.Accounts.School.PARENT, id)||
            Roles.userIsInRole(Meteor.userId(), Smartix.Accounts.School.STUDENT, id)||
            Roles.userIsInRole(Meteor.userId(), Smartix.Accounts.School.TEACHER, id)
        ) {
            return targetSchool.username;
        }
    },        
    'smartix:schools/getSchoolInfo': function(id) {
        var targetSchool = SmartixSchoolsCol.findOne(id);

        if (
            Roles.userIsInRole(Meteor.userId(), 'admin', 'system') ||
            Roles.userIsInRole(Meteor.userId(), 'admin', id)
        ) {
            return targetSchool;
        }
    },
    'smartix:schools/createSchoolTrial':function(options,imagesData){
        
        if (options) {
            options.createdAt = new Date();
            
            //TEMP: hardcode expired date = today + 30 days
            options.planTrialExpiryDate = new Date();
            options.planTrialExpiryDate.setDate( options.planTrialExpiryDate.getDate() + 30);
        } else {
            throw new Meteor.Error("require-options", "Pass School Object to create a school");
        }
        
        var imageObj;
        var imageObjId ;
        if(imagesData){
            imageObj = Images.insert(imagesData);
            imageObjId = imageObj._id;
            console.log('imageObj',imageObj);
        }
        
        SchoolsSchema.clean(options);
        check(options, SchoolsSchema);        
        
        var schoolId; 
      
        // checks that schoolname is not taken ! implemented in schema, unique
        try {
            schoolId = SmartixSchoolsCol.insert({
                name: options.name,
                logo: imageObjId || "",
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
                revenueToDateCcy: options.revenueToDateCcy
            });
        } catch (err) {
            throw err;
        }
        return schoolId;
    },
    'smartix:schools/createSchool': function(options, admins) {
        /*
        Meteor.call('smartix:schools/createSchool',{name:'Shau Kei Wan - Elsa High',username:'elsahighadmin',logo:'1234567',tel:'36655388',web:'http://www.carmel.edu.hk/',email:'elsahighschool@carmel.edu.hk.test',active:true,preferences:{}});
        */
        if (options) {
            options.createdAt = new Date();
            
            //TEMP: hardcode expired date = today + 30 days
            options.planTrialExpiryDate = new Date();
            options.planTrialExpiryDate.setDate( options.planTrialExpiryDate.getDate() + 30);
        } else {
            throw new Meteor.Error("require-options", "Pass School Object to create a school");
        }
        if (Roles.userIsInRole(Meteor.userId(), 'admin', 'system')) {
            var adminUsername = options.adminUsername || options.username;
            delete options.adminUsername;
            
            SchoolsSchema.clean(options);
            check(options, SchoolsSchema);
            
            
            if (lodash.includes(RESERVED_SCHOOL_NAMES, options.username)) {
                log.error(CANNOT_BE_SAME_AS_RESERVED_NAMES);
                return;
            }

            var schoolId;
            //TODO: logo pass upload image id
            
            var existingSchool = SmartixSchoolsCol.findOne({username:options.username});
            if(existingSchool){
                log.error('school short name has been taken');     
                throw new Meteor.Error("short-name-taken", "school short name has been taken");                
            }
            // checks that schoolname is not taken ! implemented in schema, unique
            try {
                schoolId = SmartixSchoolsCol.insert({
                    name: options.name,
                    username: options.username,
                    logo: options.logo,
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
                    revenueToDateCcy: options.revenueToDateCcy
                });
            } catch (err) {
                throw err;
            }

            var newAdmin = adminUsername;
            var newAdminPassword = "admin";
            if (admins) {
                admins.map(function(eachAdmin) {
                    Roles.addUsersToRoles(eachAdmin, 'admin', schoolId);
                });
                return { school: schoolId };
            } else {
                Meteor.call('smartix:accounts-schools/createSchoolUser',
                    options.email,
                    {
                        username: newAdmin,
                        password: newAdminPassword,
                        profile: {
                            firstName: newAdmin,
                            lastName: ""
                        }
                    },
                    schoolId,
                    ['admin'], true);

                return { school: schoolId, initialAdmin: { username: newAdmin, initialPassword: newAdminPassword } };
            }
        } else {
            log.info('caller is not authed');
            throw new Meteor.Error("caller-not-authed", "caller is not authed");
        }
    },
    'smartix:schools/editSchool': function(id, options) {
        var targetSchool = SmartixSchoolsCol.findOne(id);
        //console.log('raw',targetSchool);
        if (
            Roles.userIsInRole(Meteor.userId(), 'admin', 'system') ||
            Roles.userIsInRole(Meteor.userId(), 'admin', id)
        ) {
            // https://github.com/aldeed/meteor-simple-schema/issues/387
            delete targetSchool._id;      
            lodash.merge(targetSchool, options);
            //console.log('afterMerge',targetSchool);        
            SchoolsSchema.clean(targetSchool);              
            check(targetSchool, SchoolsSchema);             
            //console.log('afterClean',targetSchool);
            
            //return 1 if update success
            return SmartixSchoolsCol.update(id, {$set: targetSchool });

        } else {
            log.info('caller is not authed');
            throw new Meteor.Error("caller-not-authed", "caller is not authed");
        }
    },
    'smartix:schools/editSchoolTrial': function (id, schoolOptions,userOptions) {
        console.log('smartix:schools/editSchoolTrial',id,schoolOptions,userOptions);
        var targetSchool = SmartixSchoolsCol.findOne(id);
        
        //only if the school is totally new, it can be updated by anonymous
        if (targetSchool.username) {
            log.info('caller is not authed');
            throw new Meteor.Error("caller-not-authed", "caller is not authed");
        }
        //console.log('raw',targetSchool);

        // https://github.com/aldeed/meteor-simple-schema/issues/387
        delete targetSchool._id;
        lodash.merge(targetSchool, schoolOptions);
        //console.log('afterMerge',targetSchool);        
        SchoolsSchema.clean(targetSchool);
        check(targetSchool, SchoolsSchema);
        //console.log('afterClean',targetSchool);

        //return 1 if update success
        var updateCount = SmartixSchoolsCol.update(id, { $set: targetSchool });

    
        if(updateCount === 1){
            //create school admin account for user, send enrolment email                
            Meteor.call('smartix:accounts-schools/createSchoolUser',
                userOptions.email,
                {
                    username: userOptions.firstName+userOptions.lastName,
                    profile: {
                        firstName: userOptions.firstName,
                        lastName: userOptions.lastName
                    }
                },
                id,
                ['admin'], false);
                       
        }
    }

});



