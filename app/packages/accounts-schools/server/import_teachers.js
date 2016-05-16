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

	inviteParents1: { type: String , optional: true },
	inviteParents2: { type: String , optional: true },
	inviteParents3: { type: String , optional: true },
	inviteParents4: { type: String , optional: true },
	inviteParents5: { type: String , optional: true },
	inviteParents6: { type: String , optional: true },
	inviteParents7: { type: String , optional: true },
	inviteParents8: { type: String , optional: true },
	inviteParents9: { type: String , optional: true },
	inviteParents10: { type: String , optional: true }
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
	_.each(data, function(teacher, i, teachers) {

		// Checks if user already exists
		let teacherId = Accounts.findUserByEmail(teacher.email);

		// If the user does not already exists
		// Create the user
		if(teacherId === undefined) {
			let newTeacherOptions = {};
			newTeacherOptions.profile = {};
			newTeacherOptions.profile.firstName = teacher.firstName;
			newTeacherOptions.profile.lastName = teacher.lastName;
			newTeacherOptions.gender = teacher.gender;
			newTeacherOptions.mobile = teacher.mobile;
			var autoEmailVerified = true;
			teacherId = Smartix.Accounts.createUser(teacher.email, newTeacherOptions, namespace, ['teacher'], currentUser, autoEmailVerified, doNotifyEmail) [0];
		}

		if(!teacherId || typeof teacherId !== "string") {
			throw new Meteor.Error('could-not-create-teacher', "The system failed to create the teacher record for " + teacher.firstName + " " + teacher.lastName + ". Please try again.");
		}

		////////////////////////////////////
		// UPDATE TEACHER SUBJECTS TAUGHT //
		////////////////////////////////////
		let subjectsTaught = [];
		_.each(teacher, function (val, key, vals) {
			// If the key includes the term `subjectTaught`
			// Add it to the `subjectsTaught` array
			if(key.indexOf('subjectTaught') > -1) {
				subjectsTaught.push(val);
			}
		});

		// If the subjects taught are specified
		// Update the user with those subjects
		if(subjectsTaught.length > 0) {
			Meteor.users.update({
				_id: teacherId
			}, {
				$addToSet: {
					subjectsTaught: {
						$each: subjectsTaught
					}
				}
			})
		}

		////////////////////
		// CREATE CLASSES //
		////////////////////

		_.each(teacher, function (val, key, vals) {
			// If the key includes the term `subjectTaught`
			// Add it to the `subjectsTaught` array

			let classNameRegEx = /^className([0-9]{1,2})$/ig;

			if(key.match(classNameRegEx)) {
				// Create the distribution list
				// And add the teacher to the list

				// Add the users in the distribution list to the class
				let match = classNameRegEx.exec(key);
				let classNameNumber = match[1];

				let inviteParentsFieldName = "inviteParents" + classNameNumber;
				let inviteStudentsFieldName = "inviteStudents" + classNameNumber;

				let inviteParents = typeof teacher[inviteParentsFieldName] === "string" && teacher[inviteParentsFieldName].length > 0;
				let inviteStudents = typeof teacher[inviteStudentsFieldName] === "string" && teacher[inviteStudentsFieldName].length > 0;

				Smartix.Class.createClass({
					users: [],
					namespace: namespace,
					className: val,
					classCode: Smartix.Utilities.stringToLetterCase(val),
					notifyStudents: inviteStudents,
					notifyParents: inviteParents
				}, teacherId);
			}
		});

		//////////////////////////////////////
		// ADD TEACHER TO DISTRIBUTION LIST //
		//////////////////////////////////////

		_.each(teacher, function (val, key, vals) {
			// If the key includes the term `subjectTaught`
			// Add it to the `subjectsTaught` array

			let classRegEx = /^class([0-9]{1,2})$/ig;
			if(key.match(classRegEx)) {
				// Create the distribution list
				// And add the teacher to the list
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
						studentUsers = _.pull(thisDistributionList.users, correspondingClass.admins, teacherId);

						Smartix.Class.addUsersToClass(correspondingClass._id, studentUsers);
					}
				}
			}
		});
	});
};