Template.AdminLeads.onCreated(function(){
    this.subscribe('allSchools');

    this.leadsFilter = new ReactiveDict();
    this.leadsFilter.set('status', "any");
    this.leadsFilter.set('schoolName', undefined);
});

Template.AdminLeads.helpers({

    schoolObj: function(){
        var status = Template.instance().leadsFilter.get('status');
        var schoolName = Template.instance().leadsFilter.get('schoolName');
        if(status === "any")
        {
            status = {$exists: true}
        }else if (status === "active") {
            status = "page-2";
        } else {
            status = "page-1";
        }
        if (schoolName)
        {
            return SmartixSchoolsCol.find({
                $and: [
                {
                    $or: [{
                        fullname: {$regex: schoolName},
                    }, {
                        shortname: {$regex: schoolName},
                    }]
                },
                {
                    _id: {$ne: 'global'},
                    'lead.stage': status
                }]
            }).fetch();
        }
        return SmartixSchoolsCol.find({
            _id: {$ne: 'global'},
            'lead.stage': status
        }).fetch();
    },
    // getActiveUsers: function(schoolId){
    //     Meteor.call('smartix:accounts/getNumberOfUsersInNameSpace', schoolId, Meteor.userId());
    // },
    isSignUpSuccess: function(stage)
    {
        return stage==='page-2' ? true : false;
    }

});

Template.AdminLeads.events({
    'click #AdminLeads__updateFilter': function(event, template){
        Template.instance().leadsFilter.set('schoolName', template.$("#AdminLeads__studentName").val())
        Template.instance().leadsFilter.set('status', template.$("input[name='status-filter']:checked").val());
    },
    'click #AdminLeads__toCSV': function(event){
        event.preventDefault();
        createCSV();
    }
})


var createCSV = function()
{
    var matrix = [],
    i = 0;
    $("table tr").each(function() {
            var j = 0;
            matrix[i] = [];
            $(this).find('th').each(function() {
                matrix[i][j] = $(this).text().trim().replace(/(\r\n|\n|\r)/gm, "");
                j++;
                return matrix;
            });
            $(this).find('td').each(function() {
                if ($(this).text().trim().match(/[\r\n\t\\",]/)) {
                    matrix[i][j] = '"' + $(this).text().trim().replace(/"/g, '""') + '"';
                } else {
                    matrix[i][j] = $(this).text().trim();
                }
                j++;
                return matrix;
            });
            i++;
        });
        var csv = '';
        for (var i = 0; i < matrix.length; i++) {
            csv += matrix[i].join(',') + "\n";
        }
        window.open('data:text/csv,' + encodeURIComponent(csv));
}
// Template.AdminLeads.onRendered(function()
// {
//     console.log('here');

//     $.extend( $.fn.DataTable.defaults, {
//         autoWidth: false,
//         columnDefs: [{ 
//             orderable: false,
//             width: '100px',
//             targets: [ 5 ]
//         }],
//         dom: '<"datatable-header"fl><"datatable-scroll"t><"datatable-footer"ip>',
//         language: {
//             search: '<span>Filter:</span> _INPUT_',
//             lengthMenu: '<span>Show:</span> _MENU_',
//             paginate: { 'first': 'First', 'last': 'Last', 'next': '&rarr;', 'previous': '&larr;' }
//         },
//         drawCallback: function () {
//             $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').addClass('dropup');
//         },
//         preDrawCallback: function() {
//             $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').removeClass('dropup');
//         }
//     });


//     // Basic datatable
//     $('.datatable').DataTable();


//     // Alternative pagination
//     $('.datatable-pagination').DataTable({
//         pagingType: "simple",
//         language: {
//             paginate: {'next': 'Next &rarr;', 'previous': '&larr; Prev'}
//         }
//     });


//     // Datatable with saving state
//     $('.datatable-save-state').DataTable({
//         stateSave: true
//     });


//     // Scrollable datatable
//     $('.datatable-scroll-y').DataTable({
//         autoWidth: true,
//         scrollY: 300
//     });



//     // External table additions
//     // ------------------------------

//     // Add placeholder to the datatable filter option
//     $('.dataTables_filter input[type=search]').attr('placeholder','Type to filter...');


//     // Enable Select2 select for the length option
//     $('.dataTables_length select').select2({
//         minimumResultsForSearch: Infinity,
//         width: 'auto'
//     });
// });
