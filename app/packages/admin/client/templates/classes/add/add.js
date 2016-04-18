Template.AdminClassesAdd.events({
    'click #addClass-submit': function (event, template) {
        event.preventDefault();
        
        var newClass = {};
        newClass.users = [];
        newClass.type = 'class';
        newClass.className = template.$('#addClass-name').eq(0).val();
        newClass.classCode = template.$('#addClass-code').eq(0).val();
        newClass.ageRestricted = template.$('#addClass-ageRestricted').eq(0).val();
        
        
        // If the checkbox is selected,
        // Make ageRestricted `true`, otherwise `false`
        newClass.ageRestricted = newClass.ageRestricted === "on" ? true : false;
        
        Meteor.call('smartix:classes/createClass', Router.current().params.school, newClass);
    }
});