/*! Copyright (c) 2016 Little Genius Education Ltd.  All Rights Reserved. */

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


Smartix.Accounts.School.importParents = function(namespace, data, currentUser) {
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

	if(!Smartix.Accounts.School.canImportParents(namespace, currentUser)) {
		throw new Meteor.Error("permission-denied", "The user does not have permission to perform this action.");
	}

	_.each(data, function(student, i, students) {
		log.info(student);
		// Get the student data

		let studentData;

		// If the student's email is available, use that first
		if(student.studentEmail) {
			studentData = Accounts.findUserByEmail(student.studentEmail)
		}
		// Otherwise, attempt to find the student based on his/her student ID
		else if(student.studentId) {
			studentData = Meteor.users.findOne({
				studentId: student.studentId,
				schools: namespace
			})
		}

		if(!studentData) {
			throw new Meteor.Error('non-existent-user', 'The student with email: ' + student.studentEmail + " and/or student ID: " + student.studentId + " cannot be found.")
		}

		// Get the mother's email and check if the user exists
		let mother;
		if(student.motherEmail) {
			mother = Accounts.findUserByEmail(student.motherEmail);
			if(mother === undefined) {
				// Mother does not exists
				// Should create a new user
				let motherUserObj = convertStudentObjectToMother(student);
				mother = {};
				mother._id = Smartix.Accounts.createUser(student.motherEmail, motherUserObj, namespace, ['parent'], currentUser, true);
			} else if(mother === null) {
				// More than one user has the email specified
				// Should meld the accounts together
			}
		}

		// Get the father's email and check if the user exists
		let father;
		if(student.fatherEmail) {
			father = Accounts.findUserByEmail(student.fatherEmail);
			if(father === undefined) {
				// Father does not exists
				// Should create a new user
				let fatherUserObj = convertStudentObjectToFather(student);
				father = {};
				father._id = Smartix.Accounts.createUser(student.fatherEmail, fatherUserObj, namespace, ['parent'], currentUser, true);
			} else if(father === null) {
				// More than one user has the email specified
				// Should meld the accounts together
			}
		}

		// Link the parents to the child
		if(mother) {
			let motherOptions = {};
			motherOptions.namespace = namespace;
			motherOptions.parent = mother._id;
			motherOptions.child = studentData._id;
			motherOptions.name = "Mother";
			Smartix.Accounts.Relationships.createRelationship(motherOptions, currentUser);
		}

		if(father) {
			let fatherOptions = {};
			fatherOptions.namespace = namespace;
			fatherOptions.parent = father._id;
			fatherOptions.child = studentData._id;
			fatherOptions.name = "Father";
			Smartix.Accounts.Relationships.createRelationship(fatherOptions, currentUser);
		}
	});
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
	if(!data.isSet) {
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