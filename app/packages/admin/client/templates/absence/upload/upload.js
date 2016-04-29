import XLSX from 'xlsx';

var processData = function(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    var yo = allTextLines[0]
        .replace("Absent", "absent")
        .replace("Clock In", "clockIn")
        .replace("Date", "date")
        .replace("Department", "department")
        .replace("Late", "late")
        .replace("Name", "name")
        .replace(' ', '');
    allTextLines[0] = yo;
    return allTextLines.join("\n");
};

Template.AdminUploadAttendence.events({
    'change #AdminUploadAttendence__upload-file': function (event, template) {
        
        // var files = event.currentTarget.files;
        // var file = files[0];
        // var reader = new FileReader();
        // reader.onload = function(e) {
        //     var data = this.result;
        //     var workbook = XLSX.read(data, {type: 'binary'});
        //     var first_sheet_name = workbook.SheetNames[0];
        //     var attendenceAsJSON = XLSX.utils.sheet_to_json(workbook.Sheets[first_sheet_name]);
            
        //     var fieldMap = {
        //         "Absent": 'absent',
        //         "Clock In": 'clockIn',
        //         "Date": 'date',
        //         "Department": 'department',
        //         "Late": 'late',
        //         "Name": 'name'
        //     };
            
        //     processedAttendenceJSON = [];
        //     _.each(attendenceAsJSON, function(object) {
        //         return processedAttendenceJSON.push(_.reduce(object, function(finalObject, value, key) {
        //             key = fieldMap[key] || key;
        //             finalObject[key] = value;
        //             return finalObject;
        //         }, {}));
        //     });
            
        //     Meteor.call('smartix:absence/updateAttendenceRecord', processedAttendenceJSON, Router.current().params.school, function (err, res) {
                
        //     });
        // };
        // reader.readAsBinaryString(file);
        
        
    },
    'change #AdminUploadAttendence__upload-csv': function (event, template) {
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
                    Session.set('imported-attendence', results.data);
                },
                error: function (error, file) {
                    console.log(error);
                }
            });
        }
        reader.readAsText(file);
    },
    'click #AdminUploadAttendence__submit': function (event, template) {
        Meteor.call('smartix:absence/updateAttendenceRecord', Session.get('imported-attendence'), Router.current().params.school, function (err, res) {
            if(!err) {
                // Toaster to notify success
                console.log(res);
                if(res.insertCount) {
                    $('#AdminUploadAttendence__errorMsgBlock').append(res.insertCount + " records were updated successfully.<br><br>");
                }
                if(res.errors) {
                    $('#AdminUploadAttendence__errorMsgBlock').append(res.errors.join("<br><br>"));
                }
            } else {
                console.log(err);
                $('#AdminUploadAttendence__errorMsgBlock').append(err.details);
            }
        });
    }
});

Template.AdminUploadAttendence.helpers({
    importedAttendence: function () {
        return Session.get('imported-attendence');
    }
});

Template.AdminUploadAttendence.onDestroyed(function () {
    Session.set('imported-attendence', null);
});