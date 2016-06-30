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
            var importedStudents = Session.get('imported-students');
            if(Array.isArray(importedStudents)) {
                toastr.info(TAPi18n.__("Admin.ImportInProgress"));
                Session.set('imported-students', undefined);
                $("#user-upload-file").val('');
                var notifyuserwithemail = template.$('#notifyuserwithemail').is(":checked");
                //log.info("NotifyUser" + notifyuserwithemail);
                Meteor.call('smartix:accounts-schools/importStudents', UI._globalHelpers['getCurrentSchoolName'](), importedStudents, notifyuserwithemail
                    , function (err, res) {
                        var toasterOption = { timeOut:0,"newestOnTop": false };
                        if(!err) {
                            var success = res.newUsers.length;
                            var errors = res.errors.length;
                            var total = success + errors;
                            if (errors!=0) {
                                toastr.info(success + "/" + total + TAPi18n.__("Admin.ImportedUsersWithWarnings") + res.errors.length + TAPi18n.__("warnings"), null, toasterOption);
                                toastr.warning(TAPi18n.__("Admin.ImportUserWarningCause"), null,toasterOption);
                            }
                            else {
                                //toastr.info(TAPi18n.__("admin.users.import.importSuccess"), {timeOut:0});
                                toastr.info(success + "/" + total + " " + TAPi18n.__("Admin.ImportSuccess"), null,toasterOption);
                            }
                        } else {
                            toastr.error(TAPi18n.__("Admin.ImportIncorrectFormat"), null,toasterOption);
                            toastr.error(err.reason, null, toasterOption);
                            log.error(err.reason);
                        }
                    });
            } else {
                toastr.error(TAPi18n.__("Admin.ImportIncorrectFormat"));
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