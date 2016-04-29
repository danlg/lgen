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
}

Template.AdminUsersImport.events({
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
                    Session.set('imported-students', results.data);
                },
                error: function (error, file) {
                    console.log(error);
                }
            });
        }
        reader.readAsText(file);
    },
    'click #importUser-submit': function (event, template) {
        var importedStudents = Session.get('imported-students');
        if(Array.isArray(importedStudents)) {
            Meteor.call('smartix:accounts-schools/importStudents', Router.current().params.school, importedStudents, function (err, res) {
                if(!err) {
                    // Toaster to notify success
                } else {
                    console.log(err);
                    $('#importStudents__errorMsgBlock').append(err.details);
                }
            });
        } else {
            $('#importStudents__errorMsgBlock').append("Please ensure you have uploaded the file in the correct format.");
        }
    }
});

Template.AdminUsersImport.helpers({
    importedStudents: function () {
        return Session.get('imported-students');
    }
});

Template.AdminUsersImport.onDestroyed(function () {
    Session.set('imported-students', null);
})