Template.AdminClassesAdd.events({
    'click #addClass-submit': function (event, template) {
        event.preventDefault();
        
        var newClass = {};
        newClass.users = [];
        newClass.type = 'class';
        newClass.className = template.$('#addClass-name').eq(0).val();
        newClass.classCode = template.$('#addClass-code').eq(0).val();
        newClass.ageRestricted = template.$('#addClass-ageRestricted').is(":checked");
        
        Meteor.call('smartix:classes/createClass', Router.current().params.school, newClass);
    }
});