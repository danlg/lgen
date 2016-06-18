Template.AdminClassesSearch.onCreated(function () {
    this.subscribe('smartix:classes/allClassesFromSchoolName', UI._globalHelpers['getCurrentSchoolName']());
});

Template.AdminClassesSearch.helpers({
    classesIndex: function () {
        return ClassesIndex;
    },

    newsSearchInputAttributes: function () {
        return {
            placeholder: TAPi18n.__("Search"),
            class: "form-control",
            id: "newsSearchInput"
        }
    }
});