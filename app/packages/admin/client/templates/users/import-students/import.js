var processData = function(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    var yo = allTextLines[0]
        .replace("Student ID", "studentId")
        .replace("First Name", "firstName")
        .replace("Last Name", "lastName")
        .replace("E-mail Address", "email")
        .replace("Grade", "grade")
        .replace("Classroom", "classroom")
        .replace("Gender", "gender")
        .replace("Date of Birth", "dob")
        .replace("Telephone", "tel")
        .replace("Password", "password")
        .replace(' ', '');
    allTextLines[0] = yo;
    return allTextLines.join("\n");
};

var removeEmptyObjectsFromArray = function(array) {
    
    array = _.map(array, function(obj) {
        return Smartix.Utilities.removeEmptyProperties(obj);
    });
    
    return Smartix.Utilities.removeEmptyObjectsFromArray(array);
};

Template.AdminUsersImport.events({
    'click #importUser__clear': function () {
        Session.set('imported-students', undefined);
        $("#user-upload-file").val('');
    },
    'change #user-upload-file': function (event, template) {
        var files = event.currentTarget.files;
        var file = files[0];
        var reader = new FileReader();
        reader.onload = function() {
            parsedResults = processData(this.result);
            var data = Papa.parse(parsedResults, {
                header: true,
                dynamicTyping: false,
                skipEmptyLines: true,
                complete: function (results, file) {
                    var finalResults = removeEmptyObjectsFromArray(results.data);
                    Session.set('imported-students', finalResults);
                },
                error: function (error, file) {
                    log.error(error);
                }
            });
        };
        reader.readAsText(file);
    },
    'click #importUser-submit': function (event, template) {
        if(
            Router
            && Router.current()
            && Router.current().params.school
        ) {
            var importedStudents = Session.get('imported-students');
            if(Array.isArray(importedStudents)) {
                toastr.info("Users are being added. You will be notified once they have been imported.");
                Session.set('imported-students', undefined);
                $("#user-upload-file").val('');
                var notifyuserwithemail = template.$('#notifyuserwithemail').is(":checked");
                //log.info("NotifyUser" + notifyuserwithemail);
                Meteor.call('smartix:accounts-schools/importStudents', Router.current().params.school, importedStudents, notifyuserwithemail 
                    , function (err, res) {
                        var toasterOption = { timeOut:0,"newestOnTop": false };
                        if(!err) {
                            var success = res.newUsers.length;
                            var errors = res.errors.length;
                            var total = success + errors;
                            if (errors!=0) {
                                toastr.info(success + "/" + total + " users have been imported with " + res.errors.length + " warnings", null, toasterOption);
                                toastr.warning("Creating a user sharing an e-mail with an existing user or adding a new role to an existing user are the possible causes of the warning", null,toasterOption);
                            }
                            else {
                                //toastr.info(TAPi18n.__("admin.users.import.importSuccess"), {timeOut:0});
                                toastr.info(success + "/" + total + " students have been imported successfully", null,toasterOption);
                            }
                        } else {
                            toastr.error(TAPi18n.__("admin.users.import.incorrectImportFormat"), null,toasterOption);
                            toastr.error(err.reason, null, toasterOption);
                            log.error(err.reason);
                        }
                    });
            } else {
                toastr.error(TAPi18n.__("admin.users.import.incorrectImportFormat"));
            }
        } else {
            toastr.error(TAPi18n.__("applicationError.refreshRequired"));
        }
    }
});

Template.AdminUsersImport.helpers({
    importedStudents: function () {
        return Session.get('imported-students');
    }
});

Template.AdminUsersImport.onDestroyed(function () {
    Session.set('imported-students', undefined);
});