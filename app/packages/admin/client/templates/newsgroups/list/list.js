Template.AdminNewsgroupsSearch.onCreated(function () {
    if (Router
    && Router.current()
    && Router.current().params
    && Router.current().params.school
    ) {
        this.subscribe('smartix:newsgroups/allNewsgroupsFromSchoolName', Router.current().params.school);
    } else {
        log.info("Please specify a school to list the classes for");
    }
});

Template.AdminNewsgroupsSearch.helpers({
  newsgroupsIndex: function () {
      return NewsgroupsIndex;
  },
  routeData: function () {
        if (Router && Router.current()) {
            return {
                classCode: this.url,
                school: Router.current().params.school
            };
        }
    }
});