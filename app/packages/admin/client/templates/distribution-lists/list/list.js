Template.AdminDistributionListsSearch.onCreated(function () {
    if (Router
    && Router.current()
    && Router.current().params
    && Router.current().params.school
    ) {
        this.subscribe('smartix:classes/listsBySchoolName', Router.current().params.school);
    } else {
        console.log("Please specify a school to list the classes for");
    }
});

Template.AdminDistributionListsSearch.helpers({
  distributionListIndex: function () {
      return DistributionListIndex;
  },
  routeData: function () {
        if (Router && Router.current()) {
            return {
                code: this.code,
                school: Router.current().params.school
            };
        }
    }
});