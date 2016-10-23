Template.AdminNewsSearch.onCreated(function () {
    this.subscribe('allSchoolNews', UI._globalHelpers['getCurrentSchoolId']());
});

Template.AdminNewsSearch.helpers({
    NewsIndex: function () {
        return NewsIndex;
    },

    newsSearchInputAttributes: function () {
        return {
            placeholder: TAPi18n.__("Search"),
            class: "form-control",
            id: "newsSearchInput"
        }
    },
    routeData: function () {
    return {
        msgcode: this._id,
        school: UI._globalHelpers['getCurrentSchoolName']()
    }
  },
    newsSearchInputAttributes: function () {
      return {
          placeholder: TAPi18n.__("Search"),
          class: "form-control",
          id: "newsSearchInput"
      }
  },
});