Template.AddStudentNewRelationship.events({
    'click .AddStudentNewRelationship__remove': function (event, template) {
        $(event.currentTarget).closest('.addUser-newRelationship').remove();
    }
})

Template.AddStudentNewRelationship.onRendered(function () {
    $(".addStudent__newRelationship-phone").intlTelInput({
        geoIpLookup: function(callback) {
            $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
                var countryCode = (resp && resp.country) ? resp.country : "";
                callback(countryCode);
            });
        },
        preferredCountries: ["hk", "us", "gb"]
    });
})