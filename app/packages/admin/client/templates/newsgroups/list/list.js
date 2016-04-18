Template.AdminNewsgroupsSearch.onCreated(function () {
    if (Router
    && Router.current()
    && Router.current().params
    && Router.current().params.school
    ) {
        this.subscribe('smartix:classes/allClassesFromSchoolName', Router.current().params.school);
    } else {
        console.log("Please specify a school to list the classes for");
    }
});

Template.AdminNewsgroupsSearch.helpers({
  classesIndex: function () {
      return ClassesIndex;
  },
  routeData: function () {
        if (Router && Router.current()) {
            return {
                classCode: this.classCode,
                school: Router.current().params.school
            };
        }
    }
});