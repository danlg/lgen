Template.AdminClassesSearch.onCreated(function () {
    if (Router
    && Router.current()
    && Router.current().params
    && Router.current().params.school
    ) {
        this.subscribe('smartix:classes/allClassesFromSchoolName', Router.current().params.school);
    } else {
        log.info("Please specify a school to list the classes for");
    }
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