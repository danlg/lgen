/*! Copyright (c) 2016 Little Genius Education Ltd.  All Rights Reserved. */

Smartix.Accounts.School.importStudentSchema = new SimpleSchema({
	studentId: { type: String, optional: true,
		custom: function() {
			// Checks if email is set, if so, this is optional
		}
	},
	firstName: { type: String },
	lastName: { type: String },
	email: { type: String, optional: true,
		custom: function() {
			// Checks if studentId is set, if so, this is optional
		}
	},
	grade: { type: String },
	classroom: { type: String },
	gender: { type: String },
	dob: { type: String },
	tel: { type: String, optional: true },
	password: {type: String, optional: true }
});

Smartix.Accounts.School.importStudent = function(namespace, data, currentUser) {
	check(namespace, String);
	check(data, [Smartix.Accounts.School.importStudentSchema]);
	check(currentUser, Match.Maybe(String));
	// Get the `_id` of the currently-logged in user
	if (!(currentUser === null)) {
		currentUser = currentUser || Meteor.userId();
	}
	if(!Smartix.Accounts.School.canImportStudents(namespace, currentUser)) {
		throw new Meteor.Error("permission-denied", "The user does not have permission to perform this action.");
	}
	let newUsers = [];
	let errors = [];
	log.info("Importing students for school ", namespace);
	_.each(data, function(user, i, users) {
		try {
			let email = user.email;
			user.profile = {};
			user.profile.firstName = user.firstName;
			user.profile.lastName = user.lastName;
			if (user.dob) {
				user.dob = moment(user.dob, ["DD/MM/YYYY", "DD-MM-YYYY", "DD-MM-YY", "DD/MM/YY"]).format('DD-MM-YYYY');
				//stored as a date in mongo db !! why ? plus -1 day with passed date
				// user.dob = new Date(user.dob).toISOString();
			}
			delete user.firstName;
			delete user.lastName;
			delete user.email;
			log.info(i+1, "Attempting to create user ", user.profile.firstName, user.profile.lastName);
			let newUserArray = Smartix.Accounts.createUser(email, user, namespace, ['student'], currentUser, true);
			let newUserId        =   newUserArray [0];
			let newUserOrUpdated =   newUserArray [1];
			if(newUserOrUpdated) {
				newUsers.push(newUserId);
			} else {
				log.warn("The user was not created with email", email);
				errors.push(newUserId);
			}
		} catch(e) {
			errors.push(e);
			log.error("Error",e);
		}
	});
	log.info("Finished importing students for school ", namespace);
	return {
		newUsers: newUsers,
		errors: errors
	}
};

