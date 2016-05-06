Template.AdminDistributionListsSearch.onCreated(function () {
    if (Router
    && Router.current()
    && Router.current().params
    && Router.current().params.school
    ) {
        this.subscribe('smartix:distribution-listss/listsBySchoolName', Router.current().params.school);
    } else {
        log.info("Please specify a school to list the classes for");
    }
});

Template.AdminDistributionListsSearch.helpers({
  distributionListIndex: function () {
      return DistributionListIndex;
  },
  routeData: function () {
        if (Router && Router.current()) {
            return {
                code: this.url,
                school: Router.current().params.school
            };
        }
    }
});