Smartix = Smartix || {};

Smartix.Class = Smartix.Class || {};

Smartix.Class.Helpers = Smartix.Class.Helpers || {};

Smartix.Class.Helpers.getClassCode = function(className) {
    var beforeHash = Meteor.user().email + className + new Date().getTime().toString();
    return CryptoJS.SHA1(Smartix.helpers.randomString(10), beforeHash).toString().substring(0, 6);
};

Smartix.Class.Helpers.getClassCodeNew = function(className) {
    var firstname = Meteor.user().profile.firstName;
    var lastname = Meteor.user().profile.lastName;
    var name = firstname.substring(0, 1) + lastname.substring(0, 4);
    var fullname = name + className;
    return fullname.toLowerCase();
};

Smartix.Class.classIdFromClassCode = function (classCode) {
    var classObj = Smartix.Groups.Collection.findOne({
        type: 'class',
        classCode: classCode
    })
    return classObj ? classObj._id : false;
}