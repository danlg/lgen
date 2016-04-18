Template.AdminUsersImport.events({
    'change #user-upload-file': function (event, template) {
        console.log(event.currentTarget);
        var files = event.currentTarget.files;
        var file = files[0];
        var reader = new FileReader();
        reader.onload = function() {
            var data = Papa.parse(this.result);
            // console.log(this.result);
            console.log(data);
        }
        reader.readAsText(file);
    }
})