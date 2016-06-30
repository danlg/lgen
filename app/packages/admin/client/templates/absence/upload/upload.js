import XLSX from 'xlsx';

var processData = function(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    var yo = allTextLines[0]
        .replace("No.", "studentId")
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

var clearData = function () {
    Session.set('imported-attendance', undefined);
    $('#AdminUploadAttendance__upload-xlsx').val("");
    $('#AdminUploadAttendance__upload-csv').val("");
}

Template.AdminUploadAttendance.events({
    'change #AdminUploadAttendance__upload-xlsx': function (event, template) {
        
        var files = event.currentTarget.files;
        var file = files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = this.result;
            var workbook = XLSX.read(data, {type: 'binary'});
            var first_sheet_name = workbook.SheetNames[0];
            var attendanceAsJSON = XLSX.utils.sheet_to_json(workbook.Sheets[first_sheet_name]);
            
            var fieldMap = {
                "Absent": 'absent',
                "Clock In": 'clockIn',
                "Date": 'date',
                "Department": 'department',
                "Late": 'late',
                "Name": 'name'
            };
            
            processedAttendanceJSON = [];
            _.each(attendanceAsJSON, function(object) {
                return processedAttendanceJSON.push(_.reduce(object, function(finalObject, value, key) {
                    key = fieldMap[key] || key;
                    finalObject[key] = value;
                    return finalObject;
                }, {}));
            });
            
            Session.set('imported-attendance', processedAttendanceJSON);
        };
        reader.readAsBinaryString(file);
    },
    
    'change #AdminUploadAttendance__upload-csv': function (event, template) {
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
                    Session.set('imported-attendance', results.data);
                },
                error: function (error, file) {
                    log.info(error);
                }
            });
        }
        reader.readAsText(file);
    },
    'click #AdminUploadAttendance__submit': function (event, template) {
        Meteor.call('smartix:absence/updateAttendanceRecord',
            Session.get('imported-attendance'),
            UI._globalHelpers['getCurrentSchoolName'](), function (err, res) {
            if(!err) {
                // Toaster to notify success
                log.info(res);
                if(res.insertCount) {
                    toastr.info(res.insertCount + TAPi18n.__("Admin.RecordsUpdateSuccess"));
                }
                if(res.errors) {
                    toastr.error(res.errors);
                }
            } else {
                toastr.error(err.details);
            }
        });
        clearData();
    },
    'click #AdminUploadAttendance__clear': function () {
        clearData();
    }
});

Template.AdminUploadAttendance.helpers({
    importedAttendance: function () {
        return Session.get('imported-attendance');
    }
});

Template.AdminUploadAttendance.onDestroyed(function () {
    Session.set('imported-attendance', undefined);
});