Template.AdminUsersImport.events({
    'change #user-upload-file': function (event, template) {
        console.log(event.currentTarget);
        var files = event.currentTarget.files;
        var file = files[0];
        var reader = new FileReader();
        reader.onload = function() {
            var data = Papa.parse(this.result, {
                header: true,
                dynamicTyping: false,
                skipEmptyLines: true,
                complete: function (results, file) {
                    Session.set('imported-users', results.data);
                },
                error: function (error, file) {
                    console.log(error);
                }
            });
        }
        reader.readAsText(file);
    }
});

Template.AdminUsersImport.helpers({
    importedUsers: function () {
        return Session.get('imported-users');
    }
});

Template.AdminUsersImport.onDestroyed(function () {
    Session.set('imported-users', null);
})