Template.AdminDashboard.helpers({
    routeData: function () {
       return {
           school:  UI._globalHelpers['getCurrentSchoolName']()
       }
    }
})