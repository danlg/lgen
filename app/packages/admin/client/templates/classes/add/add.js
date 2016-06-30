Template.AdminClassesAdd.onCreated( function() {
    let schoolName = UI._globalHelpers['getCurrentSchoolName']();
    this.subscribe('smartix:distribution-lists/listsBySchoolName', schoolName);
});

Template.AdminClassesAdd.helpers({
    'distributionListItems':  () => {
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
        if(!newClass.className) {
            toastr.error(TAPi18n.__("ClassNameRequired"));
        }
        if(!newClass.classCode) {
            toastr.error(TAPi18n.__("ClassCodeRequired"));
        }
        if(!newClass.className || !newClass.classCode) {
            return false;
        }
        newClass.distributionLists = [];    
        $("#distribution-list :selected").each(function(){
            newClass.distributionLists.push($(this).val()); 
        });
        newClass.copyMode = $("input[name=addMode]:checked").val();
        Meteor.call('smartix:classes/createClass',  UI._globalHelpers['getCurrentSchoolName'](), newClass, function (err, res) {
            if(!err) {
                template.$('#addClass-name').val("");
                template.$('#addClass-code').val("");
                toastr.info(TAPi18n.__("ClassName") +': '+ newClass.className + TAPi18n.__("Admin.CreatedSuccessfully"));
                Router.go('admin.classes.view', {
                    school:  UI._globalHelpers['getCurrentSchoolName'](),
                    classCode: newClass.classCode});
            }
            else{
                toastr.warning(TAPi18n.__("ClassCodeErrorMessage"));
            }
        });
    }
});