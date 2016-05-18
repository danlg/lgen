/*! Copyright (c) 2016 Little Genius Education Ltd.  All Rights Reserved. */

// Test if the student can be identified
// Either by its student ID or by email
var canIdentifyStudent = function(data) {
	let studentId = data.field('studentId');
	let studentEmail = data.field('studentEmail');
	if(studentId.isSet || studentEmail.isSet) {
		return true;
	} else {
		return "At least one of Student ID or Student Email Address must be specified";
	}
};

Smartix.Accounts.School.importParentsSchema = new SimpleSchema({
	studentId: {
		type: String,
		label: "Student ID",
		optional: true,
		custom: function () {
			return canIdentifyStudent(this);
		}
	},
	studentEmail: { type: String,
		label: "Student E-mail",
		regEx: SimpleSchema.RegEx.Email,
		optional: true,
		custom: function () {
			return canIdentifyStudent(this);
		}
	},
	motherSalutation: {
		type: String,
		label: "Mother Salutation",
		optional: true
	},
	motherFirstName: {
		type: String,
		label: "Mother First Name",
		optional: true,
		custom: function() {
			return importParentsCheckIfFatherExists(this);
		}
	},
	motherLastName: {
		type: String,
		label: "Mother Last Name",
		optional: true,
		custom: function() {
			return importParentsCheckIfFatherExists(this);
		}
	},
	motherEmail: {
		type: String,
		label: "Mother E-mail",
		regEx: SimpleSchema.RegEx.Email,
		optional: true,
		custom: function() {
			return importParentsCheckIfFatherExists(this);
		}
	},
	motherMobile: {
		type: String,
		label: "Mother Mobile",
		optional: true
	},
	fatherSalutation: {
		type: String,
		label: "Father Salutation",
		optional: true
	},
	fatherFirstName: {
		type: String,
		label: "Father First Name",
		optional: true,
		custom: function() {
			return importParentsCheckIfMotherExists(this);
		}
	},
	fatherLastName: {
		type: String,
		label: "Father Last Name",
		optional: true,
		custom: function() {
			return importParentsCheckIfMotherExists(this);
		}
	},
	fatherEmail: {
		type: String,
		label: "Father E-mail",
		regEx: SimpleSchema.RegEx.Email,
		optional: true,
		custom: function() {
			return importParentsCheckIfMotherExists(this);
		}
	},
	fatherMobile: {
		type: String,
		label: "Father Mobile",
		optional: true
	},
	motherEmployer: {
		type: String,
		label: "Mother Employer",
		optional: true
	},
	motherNationality: {
		type: String,
		label: "Mother Nationality",
		optional: true
	},
	motherLanguage: {
		type: String,
		label: "Mother Language",
		optional: true
	},
	motherHomeAddress1: {
		type: String,
		label: "Mother Home Address Line 1",
		optional: true
	},
	motherHomeAddress2: {
		type: String,
		label: "Mother Home Address Line 2",
		optional: true
	},
	motherHomeCity: {
		type: String,
		label: "Mother Home City",
		optional: true
	},
	motherHomeState: {
		type: String,
		label: "Mother Home State/Province",
		optional: true
	},
	motherHomePostalCode: {
		type: String,
		label: "Mother Home Postal Code",
		optional: true
	},
	motherHomeCountry: {
		type: String,
		label: "Mother Home Country",
		optional: true
	},
	motherHomePhone: {
		type: String,
		label: "Mother Home Phone Number",
		optional: true
	},
	motherWorkAddress1: {
		type: String,
		label: "Mother Work Address Line 1",
		optional: true
	},
	motherWorkAddress2: {
		type: String,
		label: "Mother Work Address Line 2",
		optional: true
	},
	motherWorkCity: {
		type: String,
		label: "Mother Work City",
		optional: true
	},
	motherWorkState: {
		type: String,
		label: "Mother Work State/Province",
		optional: true
	},
	motherWorkPostalCode: {
		type: String,
		label: "Mother Work Postal Code",
		optional: true
	},
	motherWorkCountry: {
		type: String,
		label: "Mother Work Country",
		optional: true
	},
	motherWorkPhone: {
		type: String,
		label: "Mother Work Phone Number",
		optional: true
	},
	fatherEmployer: {
		type: String,
		label: "Father Employer",
		optional: true
	},
	fatherNationality: {
		type: String,
		label: "Father Nationality",
		optional: true
	},
	fatherLanguage: {
		type: String,
		label: "Father Language",
		optional: true
	},
	fatherHomeAddress1: {
		type: String,
		label: "Father Home Address Line 1",
		optional: true
	},
	fatherHomeAddress2: {
		type: String,
		label: "Father Home Address Line 2",
		optional: true
	},
	fatherHomeCity: {
		type: String,
		label: "Father Home City",
		optional: true
	},
	fatherHomeState: {
		type: String,
		label: "Father Home State/Province",
		optional: true
	},
	fatherHomePostalCode: {
		type: String,
		label: "Father Home Postal Code",
		optional: true
	},
	fatherHomeCountry: {
		type: String,
		label: "Father Home Country",
		optional: true
	},
	fatherHomePhone: {
		type: String,
		label: "Father Home Phone Number",
		optional: true
	},
	fatherWorkAddress1: {
		type: String,
		label: "Father Work Address Line 1",
		optional: true
	},
	fatherWorkAddress2: {
		type: String,
		label: "Father Work Address Line 2",
		optional: true
	},
	fatherWorkCity: {
		type: String,
		label: "Father Work City",
		optional: true
	},
	fatherWorkState: {
		type: String,
		label: "Father Work State/Province",
		optional: true
	},
	fatherWorkPostalCode: {
		type: String,
		label: "Father Work Postal Code",
		optional: true
	},
	fatherWorkCountry: {
		type: String,
		label: "Father Work Country",
		optional: true
	},
	fatherWorkPhone: {
		type: String,
		label: "Father Work Phone Number",
		optional: true
	}
});

Smartix.Accounts.School.getStudentRecord = function (namespace, email, studentId) {
    
    // GET THE STUDENT RECORD
    let studentData;
    
    // If the student's email is available, use that first
    if (email) {
        studentData = Accounts.findUserByEmail(email)
    }
    // If the email was provided but a user is not found or the email field didn't exist,
    // attempt to find the student based on his/her student ID
    if (studentData === undefined && studentId) {
        studentData = Meteor.users.findOne({
            studentId: studentId,
            schools: namespace
        })
    }
    // If more than one user is found with the email, select the first one
    if (studentData === null) {
        studentData = Meteor.users.findOne({
            "emails.address": email
        });
    }
    
    return studentData;
}

Smartix.Accounts.School.importParents = function(namespace, data, currentUser, doNotifyEmail) {
    
    ////////////
    // CHECKS //
    ////////////
    
	check(namespace, String);
    
	if(Array.isArray(data)) {
		_.each(data, function (parentDetails, i) {
			Smartix.Accounts.School.importParentsSchema.clean(parentDetails);
		})
	}
	check(data, [Smartix.Accounts.School.importParentsSchema]);
    
	check(currentUser, Match.Maybe(String));
	// Get the `_id` of the currently-logged in user
	if (!(currentUser === null)) {
		currentUser = currentUser || Meteor.userId();
	}
    
    // Casts `doNotifyEmail` to a boolean
    doNotifyEmail = !!doNotifyEmail;
    
    // Checks the currently-logged in user has permission to import parents
	if(!Smartix.Accounts.School.canImportParents(namespace, currentUser)) {
		throw new Meteor.Error("permission-denied", "The user does not have permission to perform this action.");
	}
    
    let returnObj = {};
    returnObj.newUsers = []; // All new users (parents) that have been created
    returnObj.existingUsers = []; // All existing users who was not imported
    returnObj.manualNotifyUsers = []; // All existing users who was not imported
	returnObj.errors = []; // Parents with incomplete records (i.e. no email nor telephone number) and was not imported
    
	log.info("Importing parents for school ", namespace);
    
    // For each student record
	_.each(data, function(student, i, students) {
        
        // Get the student document
        let studentData = Smartix.Accounts.School.getStudentRecord(namespace, student.studentEmail, student.studentId);
        
        // Could not retrieve the student record
        // Push an error to the array and carry on
		if (!studentData) {
			returnObj.errors.push(new Meteor.Error(
                'non-existent-user',
                'Line ' + (i+1) + ': The student with email: ' + student.studentEmail + " and/or student ID: " + student.studentId + " cannot be found."
            ));
		} else {
            
            // Can retrieve student record
            // Should create mother and father records if they exist
            
            log.info(i+1, ". Attempting to create father " + student.fatherEmail + " with student ID "+  student.studentId);
        
            let newFather;
            try {
                newFather = Smartix.Accounts.School.createParent({
                    namespace: namespace,
                    currentUser: currentUser,
                    email: student.fatherEmail,
                    parent: convertStudentObjectToFather(student),
                    student: studentData,
                    relationship: "Father",
                    doNotifyEmail: doNotifyEmail
                });
            } catch(e) {}
            
            if (newFather) {
                if(newFather.isNew) {
                    returnObj.newUsers.push(newFather.id);
                    if(newFather.manualNotify) {
                        // Get the user document
                        let userToNotify = Meteor.users.findOne({
                            _id: newFather.id
                        });
                        returnObj.manualNotifyUsers.push({
                            _id: newFather.id,
                            firstName: userToNotify.profile.firstName,
                            lastName: userToNotify.profile.lastName,
                            username: userToNotify.username,
                            password: userToNotify.tel
                        });
                    }
                } else {
                    returnObj.existingUsers.push(newFather.id);
                }
            } else {
                returnObj.errors.push(
                    new Meteor.Error('cannot-create-parent', 'Line ' + (i+1) + ": Cannot create father record for student with email " + student.studentEmail + " and/or student ID: " + student.studentId + ". Please ensure you have included all mandatory fields, and either an email or a phone number.")
                )
            }
            
            log.info(i+1, ". Attempting to create mother " + student.motherEmail + " with student ID "+  student.studentId);
            
            let newMother;
            try {
                newMother = Smartix.Accounts.School.createParent({
                    namespace: namespace,
                    currentUser: currentUser,
                    email: student.motherEmail,
                    parent: convertStudentObjectToMother(student),
                    student: studentData,
                    relationship: "Mother",
                    doNotifyEmail: doNotifyEmail
                });
            } catch(e) {}
            
            if (newMother) {
                if(newMother.isNew) {
                    returnObj.newUsers.push(newMother.id);
                    if(newMother.manualNotify) {
                        // Get the user document
                        let userToNotify = Meteor.users.findOne({
                            _id: newMother.id
                        });
                        returnObj.manualNotifyUsers.push({
                            _id: newMother.id,
                            firstName: userToNotify.profile.firstName,
                            lastName: userToNotify.profile.lastName,
                            username: userToNotify.username,
                            password: userToNotify.tel
                        });
                    }
                } else {
                    returnObj.existingUsers.push(newMother.id);
                }
            } else {
                returnObj.errors.push(
                    new Meteor.Error('cannot-create-parent', 'Line ' + (i+1) + ": Cannot create mother record for student with email " + student.studentEmail + " and/or student ID: " + student.studentId + ". Please ensure you have included all mandatory fields, and either an email or a phone number.")
                )
            }
        }
        
	});
    
	log.info("Finished parent import for school with namespace", namespace);
    
    return returnObj;
};

Smartix.Accounts.School.ParentSchema = new SimpleSchema({
    namespace: {
        type: String
    },
    currentUser: {
        type: String
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        optional: true
    },
    parent: {
        type: Object,
        blackbox: true
    },
    student: {
        type: Object,
        blackbox: true
    },
    relationship: {
        type: String
    },
    doNotifyEmail: {
        type: Boolean
    }
});

// Get the parent's email and check if the user exists
Smartix.Accounts.School.createParent = function(options) {
    
    Smartix.Accounts.School.ParentSchema.clean(options);
    check(options, Smartix.Accounts.School.ParentSchema);
    
    // If the parent has an email
	if (options.email) {
        // Attempt to find an existing user with the same email
		let parent = Accounts.findUserByEmail(options.email);
        
        // If the parent does not exists on record
		if (parent === undefined) {
			// Should create a new user
			let parentObj = Smartix.Accounts.createUser(options.email, options.parent, options.namespace, ['parent'], options.currentUser, true, options.doNotifyEmail);
            if (parentObj && parentObj.id) {
                Smartix.Accounts.School.createRelationShip(options.namespace, parentObj.id, options.student, options.relationship, options.currentUser, options.email);
                return {
                    id: parentObj.id,
                    isNew: parentObj.isNew
                }
            }
			return false;
		}
		else {
			// This parent already exists already
			log.warn("Parent with email " + options.email  + " already exists with id " + parent._id + ". Skipping user creation.");
			Smartix.Accounts.School.createRelationShip(options.namespace, parent._id, options.student, options.relationship, options.currentUser, options.email);
            return {
                id: parent._id,
                isNew: false
            }
		}
	} else {
        // If the parent does not have an email,
        // Attempt to create an account using the telephone number
        if(options.parent.tel) {
            // Check if someone else has the same telephone number
            let userWithSameTel = Meteor.users.findOne({
                tel: options.parent.tel
            });
            if(userWithSameTel) {
                return {
                    id: userWithSameTel._id,
                    isNew: false
                };
            } else {
                options.parent.password = options.parent.tel;
                // Create a new user, using the telephone as the password
                // Should create a new user
                let parentObj = Smartix.Accounts.createUser(undefined, options.parent, options.namespace, ['parent'], options.currentUser, true, options.doNotifyEmail);
                if (parentObj && parentObj.id) {
                    Smartix.Accounts.School.createRelationShip(options.namespace, parentObj.id, options.student, options.relationship, options.currentUser, options.email);
                    return {
                        id: parentObj.id,
                        isNew: true,
                        manualNotify: true
                    }
                }
            }
        }
    }
	return false;
};

Smartix.Accounts.School.createRelationShip = function (namespace, parentId, studentData, relationship, currentUser, parentemail) {
    
    check(studentData, Object);
    check(parentId, String);
    
	if (parentId) {
		let parentOptions = {};
		parentOptions.namespace = namespace;
		parentOptions.parent = parentId;
		parentOptions.child = studentData._id;
		parentOptions.name = relationship;
		log.info("Creating relationship between " + currentUser + " and "+ parentemail);
		Smartix.Accounts.Relationships.createRelationship(parentOptions, currentUser);
	}
};

var importParentsCheckIfMotherExists = function(data) {
	if(!data.isSet) {
		let motherFirstName = data.field('motherFirstName');
		let motherLastName = data.field('motherLastName');
		let motherEmail = data.field('motherEmail');
		// If all three of the mother's mandatory fields are set,
		// The father records are not required
		if(motherFirstName.isSet
			&& motherLastName.isSet
			&& motherEmail.isSet) {
			return true;
		} else {
			return "At least one of the mother/father details must be complete."
		}
	}
};

var importParentsCheckIfFatherExists = function(data) {
    // If one of the mother's mandatory fields is not set
	if(!data.isSet) {
        // Test to make sure the father's records exist
		let fatherFirstName = data.field('fatherFirstName');
		let fatherLastName = data.field('fatherLastName');
		let fatherEmail = data.field('fatherEmail');

		// If all three of the father's mandatory fields are set,
		// The mother records are not required
		if(fatherFirstName.isSet
			&& fatherLastName.isSet
			&& fatherEmail.isSet) {
			return true;
		} else {
			return "At least one of the mother/father details must be complete."
		}
	}
};

var convertStudentObjectToMother = function (student) {
	check(student, Object);
	let motherUserObj = {};
	if(student.motherSalutation) {
		motherUserObj.salutation = student.motherSalutation;
	}
	if(student.motherFirstName) {
		motherUserObj.profile = motherUserObj.profile || {};
		motherUserObj.profile.firstName = student.motherFirstName;
	}
	if(student.motherLastName) {
		motherUserObj.profile = motherUserObj.profile || {};
		motherUserObj.profile.lastName =  student.motherLastName;
	}
	if(student.motherMobile) {motherUserObj.tel = motherUserObj.mobile = student.motherMobile;}
	if(student.motherEmployer) {motherUserObj.employer =  student.motherEmployer;}
	if(student.motherNationality) {motherUserObj.nationality = student.motherNationality;}
	if(student.motherLanguage) {
		motherUserObj.language = student.motherLanguage;
		motherUserObj.lang = Smartix.Utilities.getLanguageCode(student.motherLanguage);
	}
	if(student.motherHomeAddress1) {motherUserObj.homeAddress1 = student.motherHomeAddress1;}
	if(student.motherHomeAddress2) {motherUserObj.homeAddress2 = student.motherHomeAddress2;}
	if(student.motherHomeCity) {motherUserObj.homeCity = motherUserObj.city = student.motherHomeCity;}
	if(student.motherHomeState) {motherUserObj.homeState = student.motherHomeState;}
	if(student.motherHomePostalCode) {motherUserObj.homePostalCode = student.motherHomePostalCode;}
	if(student.motherHomeCountry) {motherUserObj.homeCountry = student.motherHomeCountry;}
	if(student.motherHomePhone) {motherUserObj.homePhone = student.motherHomePhone;}
	if(student.motherWorkAddress1) {motherUserObj.workAddress1 = student.motherWorkAddress1;}
	if(student.motherWorkAddress2) {motherUserObj.workAddress2 = student.motherWorkAddress2;}
	if(student.motherWorkCity) {motherUserObj.workCity = student.motherWorkCity;}
	if(student.motherWorkState) {motherUserObj.workState = student.motherWorkState;}
	if(student.motherWorkPostalCode) {motherUserObj.workPostalCode = student.motherWorkPostalCode;}
	if(student.motherWorkCountry) {motherUserObj.workCountry = student.motherWorkCountry;}
	if(student.motherWorkPhone) {motherUserObj.workPhone = student.motherWorkPhone;}

	motherUserObj.gender = 'Female';
	return motherUserObj;
};

var convertStudentObjectToFather = function (student) {
	check(student, Object);
	let fatherUserObj = {};
	if(student.fatherSalutation) { fatherUserObj.salutation = student.fatherSalutation;}
	if(student.fatherFirstName) {
		fatherUserObj.profile = fatherUserObj.profile || {};
		fatherUserObj.profile.firstName = student.fatherFirstName;
	}
	if(student.fatherLastName) {
		fatherUserObj.profile = fatherUserObj.profile || {};
		fatherUserObj.profile.lastName =  student.fatherLastName;
	}
	if(student.fatherMobile)   { fatherUserObj.tel = fatherUserObj.mobile = student.fatherMobile; }
	if(student.fatherEmployer) { fatherUserObj.employer =  student.fatherEmployer;}
	if(student.fatherNationality) { fatherUserObj.nationality = student.fatherNationality; }
	if(student.fatherLanguage) {
		fatherUserObj.language = student.fatherLanguage;
		fatherUserObj.lang = Smartix.Utilities.getLanguageCode(student.fatherLanguage);
	}
	if(student.fatherHomeAddress1) {  fatherUserObj.homeAddress1 = student.fatherHomeAddress1;}
	if(student.fatherHomeAddress2) {  fatherUserObj.homeAddress2 = student.fatherHomeAddress2;}
	if(student.fatherHomeCity) {
		fatherUserObj.homeCity =  student.fatherHomeCity;
		fatherUserObj.city =  student.fatherHomeCity;
	}
	if(student.fatherHomeState) {fatherUserObj.homeState = student.fatherHomeState;}
	if(student.fatherHomePostalCode) {fatherUserObj.homePostalCode = student.fatherHomePostalCode;}
	if(student.fatherHomeCountry) {fatherUserObj.homeCountry = student.fatherHomeCountry;}
	if(student.fatherHomePhone) {fatherUserObj.homePhone = student.fatherHomePhone;}
	if(student.fatherWorkAddress1) {fatherUserObj.workAddress1 = student.fatherWorkAddress1;}
	if(student.fatherWorkAddress2) {fatherUserObj.workAddress2 = student.fatherWorkAddress2;}
	if(student.fatherWorkCity) {fatherUserObj.workCity = student.fatherWorkCity;}
	if(student.fatherWorkState) {fatherUserObj.workState = student.fatherWorkState;}
	if(student.fatherWorkPostalCode) {fatherUserObj.workPostalCode = student.fatherWorkPostalCode;}
	if(student.fatherWorkCountry) {fatherUserObj.workCountry = student.fatherWorkCountry;}
	if(student.fatherWorkPhone) {fatherUserObj.workPhone = student.fatherWorkPhone;}

	fatherUserObj.gender = 'Male';
	return fatherUserObj;
};