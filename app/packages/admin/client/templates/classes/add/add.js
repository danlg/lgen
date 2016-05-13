Template.AdminClassesAdd.onCreated(function () {
    if (Router
    && Router.current()
    && Router.current().params
    && Router.current().params.school
    ) {
        this.subscribe('smartix:distribution-lists/listsBySchoolName', Router.current().params.school);
    } else {
        log.info("Please specify a school to list the classes for");
    }
});

Template.AdminClassesAdd.helpers({
    'distributionListItems': function () {
        return Smartix.Groups.Collection.find({
            type: "distributionList"
        });
    }
});

Template.AdminClassesAdd.events({
    'click #addClass-submit': function (event, template) {
        event.preventDefault();
        
        var newClass = {};
        newClass.users = [];
        newClass.type = 'class';
        newClass.className = template.$('#addClass-name').eq(0).val();
        newClass.classCode = template.$('#addClass-code').eq(0).val();
        newClass.ageRestricted = template.$('#addClass-ageRestricted').is(":checked");
        
        newClass.distributionLists = [];    
        $("#distribution-list :selected").each(function(){
            newClass.distributionLists.push($(this).val()); 
        });
        
        newClass.copyMode = $("input[name=addMode]:checked").val();
        
        Meteor.call('smartix:classes/createClass', Router.current().params.school, newClass);
    }
});