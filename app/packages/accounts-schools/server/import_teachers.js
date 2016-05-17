/*! Copyright (c) 2016 Little Genius Education Ltd.  All Rights Reserved. */


Smartix.Accounts.School.importTeachersSchema = new SimpleSchema({
	firstName: { type: String },
	lastName: { type: String },
	email: { type: String },
	gender: { type: String , optional: true },
	mobile: { type: String , optional: true },

	subjectTaught1: { type: String },
	subjectTaught2: { type: String , optional: true },
	subjectTaught3: { type: String , optional: true },
	subjectTaught4: { type: String , optional: true },
	subjectTaught5: { type: String , optional: true },
	subjectTaught6: { type: String , optional: true },
	subjectTaught7: { type: String , optional: true },

	class1: { type: String , optional: true },
	class2: { type: String , optional: true },
	class3: { type: String , optional: true },
	class4: { type: String , optional: true },
	class5: { type: String , optional: true },
	class6: { type: String , optional: true },
	class7: { type: String , optional: true },
	class8: { type: String , optional: true },
	class9: { type: String , optional: true },
	class10: { type: String , optional: true },

	className1: { type: String , optional: true },
	className2: { type: String , optional: true },
	className3: { type: String , optional: true },
	className4: { type: String , optional: true },
	className5: { type: String , optional: true },
	className6: { type: String , optional: true },
	className7: { type: String , optional: true },
	className8: { type: String , optional: true },
	className9: { type: String , optional: true },
	className10: { type: String , optional: true },

	inviteParents1: { type: String , optional: true },
	inviteParents2: { type: String , optional: true },
	inviteParents3: { type: String , optional: true },
	inviteParents4: { type: String , optional: true },
	inviteParents5: { type: String , optional: true },
	inviteParents6: { type: String , optional: true },
	inviteParents7: { type: String , optional: true },
	inviteParents8: { type: String , optional: true },
	inviteParents9: { type: String , optional: true },
	inviteParents10: { type: String , optional: true },

	inviteStudents1: { type: String , optional: true },
	inviteStudents2: { type: String , optional: true },
	inviteStudents3: { type: String , optional: true },
	inviteStudents4: { type: String , optional: true },
	inviteStudents5: { type: String , optional: true },
	inviteStudents6: { type: String , optional: true },
	inviteStudents7: { type: String , optional: true },
	inviteStudents8: { type: String , optional: true },
	inviteStudents9: { type: String , optional: true },
	inviteStudents10: { type: String , optional: true }
});
Smartix.Accounts.School.importTeachers = function(namespace, data, currentUser, doNotifyEmail) {
	check(namespace, String);
	_.each(data, function (teacher) {
		Smartix.Accounts.School.importTeachersSchema.clean(teacher);
	});
	check(data, [Smartix.Accounts.School.importTeachersSchema]);
	check(currentUser, Match.Maybe(String));
	// Get the `_id` of the currently-logged in user
	if (!(currentUser === null)) {
		currentUser = currentUser || Meteor.userId();
	}
	if(!Smartix.Accounts.School.canImportTeachers(namespace, currentUser)) {
		throw new Meteor.Error("permission-denied", "The user does not have permission to perform this action.");
	}
	let newUsers = [];
	let errors = [];
	log.info("Importing teachers and staff for school ", namespace);
	_.each(data, function(teacher, i) {
		let newUserObj, teacherId;
		try{
			// Checks if user already exists
			//teacherId = Accounts.findUserByEmail(teacher.email);
			// If the user does not already exists
			// Create the user
			//if(teacherId === undefined) {
			let user = {};
			user.profile = {};
			user.profile.firstName = teacher.firstName;
			user.profile.lastName = teacher.lastName;
			user.gender = teacher.gender;
			user.mobile = teacher.mobile;
			var autoEmailVerified = true;
			log.info(i+1, "Attempting to create user ", user.profile.firstName, user.profile.lastName);
			newUserObj = Smartix.Accounts.createUser(teacher.email, user, namespace, ['teacher'], currentUser, autoEmailVerified, doNotifyEmail);
			teacherId = newUserObj.id;
			if(newUserObj.isNew) {
				newUsers.push(newUserObj.id);
			} else {
				log.warn("The user was not created with email", email);
				errors.push(newUserObj.id);
			}
			//}
		} catch(e) {
			errors.push(e);
			log.error("Error",e);
		}
		//log.info("Attempting to create teacher obj", teacherObj);
		// if(!newUserObj || typeof newUserObj.id !== "string") {
		// 	//log.info(teacherObj);
		// 	throw new Meteor.Error('could-not-create-teacher', "The system failed to create the teacher record for " + teacher.firstName + " " + teacher.lastName + ". Please try again.");
		// }

		// UPDATE TEACHER SUBJECTS TAUGHT
		let subjectsTaught = [];
		_.each(teacher, function (val, key, vals) {
			// If the key includes the term `subjectTaught`
			// Add it to the `subjectsTaught` array
			if(key.indexOf('subjectTaught') > -1) {
				subjectsTaught.push(val);
			}
		});

		// If the subjects taught are specified, update the user with those subjects
		if(subjectsTaught.length > 0) {
			Meteor.users.update({
				_id: newUserObj.id
			}, {
				$addToSet: {
					subjectsTaught: {
						$each: subjectsTaught
					}
				}
			})
		}

		// CREATE CLASSES
		//log.info("teacher");
		//log.info(teacher);
		_.each(teacher, function (val, key) {
			// If the key includes the term `subjectTaught`, add it to the `subjectsTaught` array
			let classNameRegEx = /^className([0-9]{1,2})$/ig;
			if(key.match(classNameRegEx)) {
				// Create the distribution list and add the teacher to the list
				// Add the users in the distribution list to the class
				let match = classNameRegEx.exec(key);
				let classNameNumber = match[1];

				let inviteParentsFieldName = "inviteParents" + classNameNumber;
				let inviteStudentsFieldName = "inviteStudents" + classNameNumber;

				let inviteParents  = ( typeof teacher[inviteParentsFieldName ] === "string" && teacher[inviteParentsFieldName ].length > 0 );
				let inviteStudents = ( typeof teacher[inviteStudentsFieldName] === "string" && teacher[inviteStudentsFieldName].length > 0 );
				log.info("Creating class"+ val + " for teacher "+ teacherId);
				Smartix.Class.createClass({
					users: [],
					namespace: namespace,
					className: val,
					classCode: Smartix.Utilities.stringToLetterCase(val),
					notifyStudents: inviteStudents,
					notifyParents: inviteParents
				}, teacherId);
			}
			else{
				log.warn("No class created for teacher "+ teacherId + " with key=" + key + "and classname=" + val);
			}
		});

		// ADD TEACHER TO DISTRIBUTION LIST
		_.each(teacher, function (val, key) {
			// If the key includes the term `subjectTaught`, add it to the `subjectsTaught` array
			//see header in import-teachers/import.js in processData
			let classRegEx = /^class([0-9]{1,2})$/ig;
			if(key.match(classRegEx)) {
				// Create the distribution list, and add the teacher to the list
				log.info("Creating distribution list "+ val + " for teacher "+ teacherId);
				Smartix.DistributionLists.createDistributionList({
					users: [teacherId],
					namespace: namespace,
					name: val,
					expectDuplicates: true,
					upsert: true
				}, currentUser);

				// Add the users in the distribution list to the class
				let match = classRegEx.exec(key);
				let classNumber  = match[1];
				let classNameFieldName = "className" + classNumber;
				// If the class is actually specified
				if(teacher[classNameFieldName]) {
					// Get the class ID
					let correspondingClass = Smartix.Groups.Collection.findOne({
						className: teacher[classNameFieldName],
						type: "class"
					});
					let thisDistributionList = Smartix.Groups.Collection.findOne({
						name: val,
						type: "distributionList"
					});
					if(correspondingClass && thisDistributionList) {
						// Gets a list of all users who are not the teacher
						let studentUsers = _.pull(thisDistributionList.users, correspondingClass.admins, teacherId);
						Smartix.Class.addUsersToClass(correspondingClass._id, studentUsers);
					}
				}
			}
			//else{
			//	log.warn("No distribution list created for teacher "+ teacherId + " with key=" + key + "and classname=" + val);
			//}
		});
	});
	log.info("Finished importing teachers and staff for school ", namespace);
	return {
		newUsers: newUsers,
		errors: errors
	}
};