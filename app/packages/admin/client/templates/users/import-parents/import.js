var processData = function(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    var yo = allTextLines[0]
        .replace("Student ID", "studentId")
        .replace("Student E-mail", "studentEmail")
        .replace("Mother Salutation", "motherSalutation")
        .replace("Mother First Name", "motherFirstName")
        .replace("Mother Last Name", "motherLastName")
        .replace("Mother E-mail", "motherEmail")
        .replace("Mother Mobile", "motherMobile")
        .replace("Mother Employer", "motherEmployer")
        .replace("Mother Nationality", "motherNationality")
        .replace("Mother Language", "motherLanguage")
        .replace("Mother Home Address Line 1", "motherHomeAddress1")
        .replace("Mother Home Address Line 2", "motherHomeAddress2")
        .replace("Mother Home City", "motherHomeCity")
        .replace("Mother Home State/Province", "motherHomeState")
        .replace("Mother Home Postal Code", "motherHomePostalCode")
        .replace("Mother Home Country", "motherHomeCountry")
        .replace("Mother Home Phone Number", "motherHomePhone")
        .replace("Mother Work Address Line 1", "motherWorkAddress1")
        .replace("Mother Work Address Line 2", "motherWorkAddress2")
        .replace("Mother Work City", "motherWorkCity")
        .replace("Mother Work State/Province", "motherWorkState")
        .replace("Mother Work Postal Code", "motherWorkPostalCode")
        .replace("Mother Work Country", "motherWorkCountry")
        .replace("Mother Work Phone Number", "motherWorkPhone")
        .replace("Father Salutation", "fatherSalutation")
        .replace("Father First Name", "fatherFirstName")
        .replace("Father Last Name", "fatherLastName")
        .replace("Father E-mail", "fatherEmail")
        .replace("Father Mobile", "fatherMobile")
        .replace("Father Employer", "fatherEmployer")
        .replace("Father Nationality", "fatherNationality")
        .replace("Father Language", "fatherLanguage")
        .replace("Father Home Address Line 1", "fatherHomeAddress1")
        .replace("Father Home Address Line 2", "fatherHomeAddress2")
        .replace("Father Home City", "fatherHomeCity")
        .replace("Father Home State/Province", "fatherHomeState")
        .replace("Father Home Postal Code", "fatherHomePostalCode")
        .replace("Father Home Country", "fatherHomeCountry")
        .replace("Father Home Phone Number", "fatherHomePhone")
        .replace("Father Work Address Line 1", "fatherWorkAddress1")
        .replace("Father Work Address Line 2", "fatherWorkAddress2")
        .replace("Father Work City", "fatherWorkCity")
        .replace("Father Work State/Province", "fatherWorkState")
        .replace("Father Work Postal Code", "fatherWorkPostalCode")
        .replace("Father Work Country", "fatherWorkCountry")
        .replace("Father Work Phone Number", "fatherWorkPhone")
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

Template.AdminParentsImport.events({
    'change #parents-upload-file': function (event, template) {
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
                    Session.set('imported-parents', finalResults);
                },
                error: function (error, file) {
                    log.info(error);
                }
            });
        };
        reader.readAsText(file);
    },
    'click #AdminParentsImport__submit': function (event, template) {
        var importedParents = Session.get('imported-parents');
        if(Router
            && Router.current()
            && Router.current().params
            && Router.current().params.school
        ) {
            if(Array.isArray(importedParents)) {
                var notifyuserwithemail = template.$('#notifyuserwithemail').is(":checked");
                var toasterOption = {
                    timeOut: 0,
                    "newestOnTop": false
                };
                Meteor.call('smartix:accounts-schools/importParents', Router.current().params.school, importedParents, notifyuserwithemail, function (err, res) {
                    
                    if(!err) {
                        Session.set('importErrors', res.errors);
                        Session.set('manualNotifyUsers', res.manualNotifyUsers);
                        
                        toastr.info(res.newUsers.length + " new users have been imported.", null, toasterOption);
                        toastr.info(res.existingUsers.length + " users already exists and was not imported.", null, toasterOption);
                    } else {
                        toastr.error(TAPi18n.__("admin.users.import.incorrectImportFormat"), null,toasterOption);
                        toastr.error(err.reason, null, toasterOption);
                        log.error(err.reason);
                    }
                });
                toastr.info('Attempting to import ' + importedParents.length + " records.", null, toasterOption);
                Session.set('imported-parents', undefined);
                $("#parents-upload-file").val('');
            } else {
                toastr.error(TAPi18n.__("admin.users.import.incorrectImportFormat"));
            }
        } else {
            toastr.error(TAPi18n.__("applicationError.refreshRequired"));
        }
    },
    'click #ParentsImport_clear': function () {
        Session.set('imported-parents', undefined);
    },
    'click #ParentsImport_logsClear': function () {
        Session.set('importErrors', undefined);
    },
    'click #ParentsImport_notifyClear': function () {
        Session.set('manualNotifyUsers', undefined);
    }
});

Template.AdminParentsImport.helpers({
    importedParents: function () {
        return Session.get('imported-parents');
    },
    importErrors: function () {
        return Session.get('importErrors');
    },
    manualNotifyUsers: function () {
        return Session.get('manualNotifyUsers');
    }
});

Template.AdminParentsImport.onDestroyed(function () {
    Session.set('imported-parents', undefined);
    Session.set('importErrors', undefined);
    Session.set('manualNotifyUsers', undefined);
});