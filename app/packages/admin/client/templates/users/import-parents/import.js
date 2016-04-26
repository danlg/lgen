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
}

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
                    Session.set('imported-parents', results.data);
                },
                error: function (error, file) {
                    console.log(error);
                }
            });
        }
        reader.readAsText(file);
    },
    'click #AdminParentsImport__submit': function (event, template) {
        Meteor.call('smartix:accounts-schools/importParents', Router.current().params.school, Session.get('imported-parents'), function (err, res) {
            if(!err) {
                // Toaster to notify success
            } else {
                console.log(err);
                $('#AdminParentsImport__errorMsgBlock').append(err.details);
            }
        });
    }
});

Template.AdminParentsImport.helpers({
    importedParents: function () {
        return Session.get('imported-parents');
    }
});

Template.AdminParentsImport.onDestroyed(function () {
    Session.set('imported-parents', null);
})