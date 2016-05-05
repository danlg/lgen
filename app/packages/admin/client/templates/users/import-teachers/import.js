var processData = function(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    // Converts all to lowercase and replace multiple spaces with one space
    var yo = allTextLines[0].toLowerCase().replace(/\s\s+/g, ' ');
    yo = yo
        .replace("teacher first name", "firstName")
        .replace("teacher last name", "lastName")
        .replace("teacher email", "email")
        .replace("gender", "gender")
        .replace("mobile phone", "mobile")
        .replace("subject taught 1", "subjectTaught1")
        .replace("subject taught 2", "subjectTaught2")
        .replace("subject taught 3", "subjectTaught3")
        .replace("subject taught 4", "subjectTaught4")
        .replace("subject taught 5", "subjectTaught5")
        .replace("subject taught 6", "subjectTaught6")
        .replace("subject taught 7", "subjectTaught7")
        .replace("class 1", "class1")
        .replace("class 2", "class2")
        .replace("class 3", "class3")
        .replace("class 4", "class4")
        .replace("class 5", "class5")
        .replace("class 6", "class6")
        .replace("class 7", "class7")
        .replace("class 8", "class8")
        .replace("class 9", "class9")
        .replace("class 10", "class10")
        .replace("smartix classname 1", "className1")
        .replace("smartix classname 2", "className2")
        .replace("smartix classname 3", "className3")
        .replace("smartix classname 4", "className4")
        .replace("smartix classname 5", "className5")
        .replace("smartix classname 6", "className6")
        .replace("smartix classname 7", "className7")
        .replace("smartix classname 8", "className8")
        .replace("smartix classname 9", "className9")
        .replace("smartix classname 10", "className10")
        .replace("invite parents class 1", "inviteParents1")
        .replace("invite parents class 2", "inviteParents2")
        .replace("invite parents class 3", "inviteParents3")
        .replace("invite parents class 4", "inviteParents4")
        .replace("invite parents class 5", "inviteParents5")
        .replace("invite parents class 6", "inviteParents6")
        .replace("invite parents class 7", "inviteParents7")
        .replace("invite parents class 8", "inviteParents8")
        .replace("invite parents class 9", "inviteParents9")
        .replace("invite parents class 10", "inviteParents10")
        .replace("invite students class 1", "inviteStudents1")
        .replace("invite students class 2", "inviteStudents2")
        .replace("invite students class 3", "inviteStudents3")
        .replace("invite students class 4", "inviteStudents4")
        .replace("invite students class 5", "inviteStudents5")
        .replace("invite students class 6", "inviteStudents6")
        .replace("invite students class 7", "inviteStudents7")
        .replace("invite students class 8", "inviteStudents8")
        .replace("invite students class 9", "inviteStudents9")
        .replace("invite students class 10", "inviteStudents10")
        .replace(' ', '')
        // Removes any non-alphanumeric characters or commas
        .replace(/[^\w,]+/g, '');
    allTextLines[0] = yo;
    return allTextLines.join("\n");
}

var removeEmptyObjectsFromArray = function(array) {
    
    array = _.map(array, function(obj) {
        return Smartix.Utilities.removeEmptyProperties(obj);
    });
    
    return Smartix.Utilities.removeEmptyObjectsFromArray(array);
}

Template.AdminTeachersImport.events({
    'change #teachers-upload-file': function (event, template) {
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
                    Session.set('imported-teachers', finalResults);
                },
                error: function (error, file) {
                    log.info(error);
                }
            });
        }
        reader.readAsText(file);
    },
    'click #AdminTeachersImport__submit': function (event, template) {
        var importedTeachers = Session.get('imported-teachers');
        if(Router
            && Router.current()
            && Router.current().params
            && Router.current().params.school
        ) {
            if(Array.isArray(importedTeachers)) {
                Meteor.call('smartix:accounts-schools/importTeachers', Router.current().params.school, importedTeachers, function (err, res) {
                    if(!err) {
                        toastr.info(TAPi18n.__("admin.users.import.importSuccess"));
                    } else {
                        if(err.reason) {
                            toastr.error(err.reason);
                        } else if (err.message) {
                            toastr.error(err.message);
                        } else {
                            toastr.error(TAPi18n.__("admin.users.import.incorrectImportFormat"));
                        }
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

Template.AdminTeachersImport.helpers({
    importedTeachers: function () {
        return Session.get('imported-teachers');
    }
});

Template.AdminTeachersImport.onDestroyed(function () {
    Session.set('imported-teachers', null);
})