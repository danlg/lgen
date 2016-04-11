if (Meteor.isServer) {

    Meteor.methods({
        'smartix:schools/getSchoolInfo': function(id) {
            var targetSchool = SmartixSchoolsCol.findOne(id);

            if (
                Roles.userIsInRole(Meteor.userId(), 'admin', 'system') ||
                Roles.userIsInRole(Meteor.userId(), 'admin', id)
            ) {
                return targetSchool;
            }
        },
        'smartix:schools/createSchool': function(options, admins) {
            /*
            Meteor.call('smartix:schools/createSchool',{name:'Shau Kei Wan - Elsa High',username:'elsahighadmin',logo:'1234567',tel:'36655388',web:'http://www.carmel.edu.hk/',email:'elsahighschool@carmel.edu.hk.test',active:true,preferences:{}});
            */
            if (options) {

            } else {
                throw new Meteor.Error("require-options", "Pass School Object to create a school");
            }
            if (Roles.userIsInRole(Meteor.userId(), 'admin', 'system')) {
                check(options, SchoolsSchema);

                if (lodash.includes(RESERVED_SCHOOL_NAMES, options.username)) {
                    console.log(CANNOT_BE_SAME_AS_RESERVED_NAMES);
                    return;
                }

                var schoolId;
                //TODO: logo pass upload image id
                try {
                    schoolId = SmartixSchoolsCol.insert({
                        name: options.name,
                        username: options.username,
                        logo: options.logo,
                        tel: options.tel,
                        web: options.web,
                        email: options.email,
                        active: true,
                        preferences: {}
                    });
                } catch (err) {
                    throw err;
                }

                var newAdmin = options.username;
                var newAdminPassword = Random.id();
                if (admins) {

                    admins.map(function(eachAdmin) {
                        Roles.addUsersToRoles(eachAdmin, 'admin', schoolId);
                    })

                    return { school: schoolId };

                } else {
                    //console.log('createSchoolUser',schoolId);
                    Meteor.call('smartix:accounts-schools/createSchoolUser', schoolId, {
                        role: 'admin',
                        username: newAdmin,
                        password: newAdminPassword,
                        email: options.email,
                        profile: {
                            firstname: newAdmin,
                            lastname: ""
                        }
                    });

                    return { school: schoolId, initialAdmin: { username: newAdmin, initialPassword: newAdminPassword } };
                }



            } else {
                console.log('caller is not authed');
                throw new Meteor.Error("caller-not-authed", "caller is not authed");
            }
        },
        'smartix:schools/editSchool': function(id, options) {
            var targetSchool = SmartixSchoolsCol.findOne(id);
            if (
                Roles.userIsInRole(Meteor.userId(), 'admin', 'system') ||
                Roles.userIsInRole(Meteor.userId(), 'admin', id)
            ) {

                lodash.merge(targetSchool, options);
                check(targetSchool, SchoolsSchema);

                //return 1 if update success
                return SmartixSchoolsCol.update(id, targetSchool);

            } else {
                console.log('caller is not authed');
                throw new Meteor.Error("caller-not-authed", "caller is not authed");
            }
        },

    });
}

SmartixSchools = SmartixSchools || {};

//file path is passed to insert the image. template is passed from template events
//so as to set reactiveVar as newly uploaded file's id
SmartixSchools.editLogo = function(filePath,template) {
    
    Images.insert(filePath, function(err, fileObj) {
        if (err) log.error(err);
        else {
            log.info(fileObj);
            
            //if there is a reactiveVar named newSchoolLogo
            if(template && template.newSchoolLogo){
                template.newSchoolLogo.set(fileObj._id);
            }
                    
        }
    });
};

