Template.adminLayout.onCreated(function () {
    var schoolName = UI._globalHelpers['getCurrentSchoolName']();
    if(schoolName)
    {
        this.subscribe('schoolInfo', schoolName);
        this.subscribe('images', schoolName, 'school', schoolName);
    }
});

Template.adminLayout.events({
    'click .sidebar-main-toggle': function () {
        // Initialize mini sidebar 
        miniSidebar();
    },
    'affix.bs.affix .sidebar-fixed': function () {
        initScroll();
        resizeDetached();
        miniSidebar();
    },
    'affix.bs.affix .sidebar-main, affix.bs.affix .sidebar-fixed': function () {
        miniSidebar();
    },
    'affix-top.bs.affix .sidebar-fixed': function () {
        // When effixed top, remove scrollbar and its data
        // removeScroll();
        $(".sidebar-fixed .sidebar-content").removeAttr('style').removeAttr('tabindex');
    },
    // Remove affix and scrollbar on mobile
    'resize window': function() {
        setTimeout(function() {            
            if($(window).width() <= 768) {

                // Remove nicescroll on mobiles
                // removeScroll();

                // Remove affix on mobile
                $(window).off('.affix')
                $('.sidebar-fixed').removeData('affix').removeClass('affix affix-top affix-bottom');
            }
        }, 100);
        $(window).resize();
    },
    'click #adminLayout__signOut': function (event, template) {
        event.preventDefault();
        Meteor.logout(function (err) {
            if(!err) {
                toastr.info(TAPi18n.__('SignOutSuccess'))
            } else {
                toastr.error(TAPi18n.__('SignOutFailure'))
            }
        })
    }
});

Template.adminLayout.helpers({
    routeData: function () {
       return {
                school:  UI._globalHelpers['getCurrentSchoolName']()
        }
    },
    //we should put here the long school name, watchout if use for server side
    schoolDisplayName: function () {
        var schoolDoc = SmartixSchoolsCol.findOne();
        if(schoolDoc)
            return  schoolDoc.fullname;
        else
            return "";
    },

    schoolLogo:function(){
        var schoolDoc = SmartixSchoolsCol.findOne();
        return Images.findOne(schoolDoc.logo);
    }
});

Template.registerHelper('currentUsername', function () {
    return Meteor.user().username;
});

Template.registerHelper('currentFirstName', function () {
    return Meteor.user().profile.firstName;
});

Template.registerHelper('currentLastName', function () {
    return Meteor.user().profile.lastName;
});

function miniSidebar() {
    if ($('body').hasClass('sidebar-xs')) {
        $('.sidebar-main .sidebar-fixed .sidebar-content').on('mouseenter', function () {
            if ($('body').hasClass('sidebar-xs')) {

                // Expand fixed navbar
                $('body').removeClass('sidebar-xs').addClass('sidebar-fixed-expanded');
            }
        }).on('mouseleave', function () {
            if ($('body').hasClass('sidebar-fixed-expanded')) {

                // Collapse fixed navbar
                $('body').removeClass('sidebar-fixed-expanded').addClass('sidebar-xs');
            }
        });
    }
}



// Resize detached sidebar vertically when bottom reached
function resizeDetached() {
	$(window).on('scroll', function() {
	  if ($(window).scrollTop() > $(document).height() - $(window).height() - 70) {
	    $('.sidebar-fixed').addClass('fixed-sidebar-space');
	    resizeScroll();
	  }
	  else {
	    $('.sidebar-fixed').removeClass('fixed-sidebar-space');
	    resizeScroll();
	  }
	});
}

// Template.adminLayout.onRendered(function () {
//     // Attach BS affix component to the sidebar
//     $('.sidebar-fixed').affix({
//         offset: {
//             top: $('.sidebar-fixed').offset().top - 20 // top offset - computed line height
//         }
//     });
// });


// // Nice scroll
// // Setup
// function initScroll() {
//     $(".sidebar-fixed .sidebar-content").niceScroll({
//         mousescrollstep: 100,
//         cursorcolor: '#ccc',
//         cursorborder: '',
//         cursorwidth: 3,
//         hidecursordelay: 100,
//         autohidemode: 'scroll',
//         horizrailenabled: false,
//         preservenativescrolling: false,
//         railpadding: {
//         	right: 0.5,
//         	top: 1.5,
//         	bottom: 1.5
//         }
//     });
// }

// // Resize
// function resizeScroll() {
// 	$('.sidebar-fixed .sidebar-content').getNiceScroll().resize();
// }

// // Remove
// function removeScroll() {
// 	$(".sidebar-fixed .sidebar-content").getNiceScroll().remove();
// 	$(".sidebar-fixed .sidebar-content").removeAttr('style').removeAttr('tabindex');
// }


// Resize sidebar on scroll
// ------------------------------