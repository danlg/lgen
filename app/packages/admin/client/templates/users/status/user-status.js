Template.UserStatusSearch.onCreated(function () {
    var self = this;
    this.schoolUsername = UI._globalHelpers['getCurrentSchoolName']();
    this.namespace  = UI._globalHelpers['getCurrentSchoolId']();
    Template.instance().parentMap  = new ReactiveVar({});
    if (this.schoolUsername) {
        // subscribe to the school info first
        //log.info('packages/admin/client/template/users/list#schoolUsername: ' + schoolUsername);
        //log.info('Template.UserStatusSearch.onCreated', schoolNamespace);
        if(this.namespace) {
            this.subscribe('userStatus', this.namespace, function (err, res) {});
            //we cache the data, a bit heavy , eager loading but should preserve round trip when searching
            this.subscribe('ALLUsersRelationships', Meteor.userId(), this.namespace,  (err, res) => {
            });
        }
    }
    this.modalName = new ReactiveVar("");
    this.modalTitle = new ReactiveVar("");
    this.modalBody = new ReactiveVar("");
    this.chosenRole = new ReactiveVar("all");
    //this.connectStatus = new ReactiveVar("allconnection");
    this.loginStatus = new ReactiveVar("anyLoggedIn");
});

// var findUser = (uid) => {
//     let user = Meteor.users.findOne({_id: uid});
//     if (user) {
//         return user;
//     }
//     else {  log.info("Cannot find user ", uid); }
// };

Template.UserStatusSearch.helpers({

    lastLogin:(uid) => {
        if(Template.instance().subscriptionsReady()) {
            let user =  Meteor.users.findOne({_id: uid });
            if(user.status && user.status.lastLogin && user.status.lastLogin.date){
                //log.info("login found",user.status);
                return user.status.lastLogin.date;
            }
            else {
                return "Never";
                //sort is not working..
            }
        }
    },

    online:(uid) => {
        if(Template.instance().subscriptionsReady()) {
            let user =  Meteor.users.findOne({ _id: uid});
            if(user.status && user.status.online ){
                //return "online";
                return "e1a-white_check_mark";
            }
            else {
                // return "offline";
                return "e1a-negative_squared_cross_mark";
            }
        }
    },
    userAgent:(uid) => {
        if(Template.instance().subscriptionsReady()) {
            let user =  Meteor.users.findOne({ _id: uid});
            if(user.status && user.status.lastLogin && user.status.lastLogin.userAgent){
                //log.info("login found",user.status);
                return user.status.lastLogin.userAgent;
            }
            else {
                //log.info(user.status);
                return "N/A";
            }
        }
    },

    classroom:(uid) => {
        let user =  Meteor.users.findOne({ _id: uid}); //log.info("user_classroom", user);
        if (user.classroom) {
            return user.classroom;
        }
        else if (user.classroom_shadow){
            return user.classroom_shadow;
        }
        else return  "";
    },

    grade:(uid) => {
        let user =  Meteor.users.findOne({ _id: uid}); //log.info("user_classroom", user);
        if (user.grade) {
            return user.grade;
        }
        else if (user.grade_shadow){
            return user.grade_shadow;
        }
        else return  "";
    },

    getUserEmail:function(){
        if(this.emails){
            return this.emails[0].address;
        }
    },

    getUserRoles:function(){
        var schoolId = UI._globalHelpers['getCurrentSchoolId']();
        if(schoolId){
            let role = "";
            if(this.roles) {
                role = this.roles[schoolId].toString();//in English
                role = TAPi18n.__ ( role);
            }
            return role;
        }
    },

    getUserId:function(){
        return this._id;
    }

    , totalUserCount:function(){
        return Meteor.users.find( {},{ fields:{ _id: 1} } ).count();
    },

    usersStatusIndex: function () {
        if (Template.instance().subscriptionsReady()) {
            return UsersStatusIndex;
        }
    },
    routeData: function () {
        return {
            uid: this._id,
            school: UI._globalHelpers['getCurrentSchoolName']()
        };
    },
    userStatusSearchInputAttributes: function () {
        return {
            placeholder: TAPi18n.__("Admin.FilterUserStatus"),
            class: "form-control",
            id: "UserStatusSearchInput"
        }
    },
    getModalName:function(){
        return Template.instance().modalName.get();
    },
    getModalTitle:function(){
        return Template.instance().modalTitle.get();
    },
    getModalBody:function(){
        return Template.instance().modalBody.get();
    }
});

Template.UserStatusSearch.events({
    'click .filter-by-role-btn':function(event,template){
        //var chosenRole    =  $(event.target).data('role');
        template.chosenRole.set( $(event.target).data('role') );
        //log.info("filter-by-role-btn:chosenRole", chosenRole);
        //log.info("filter-by-role-btn:namespace", template.namespace);
        UsersStatusIndex.getComponentMethods().addProps('schoolNamespace', template.namespace);
        UsersStatusIndex.getComponentMethods().addProps('role', template.chosenRole.get());
        //UsersStatusIndex.getComponentMethods().addProps('connectStatus', template.connectStatus.get());
        UsersStatusIndex.getComponentMethods().addProps('loginStatus', template.loginStatus.get());
    },
    // this.chosenRole = new ReactiveVar("all");
// this.connectStatus = new ReactiveVar("allconnection");
// this.loginStatus = new ReactiveVar("anyLoggedIn");

    'click .filter-by-last-login-btn':function(event,template){
        let loginStatus =  $(event.target).data('loginstatus');
        if (loginStatus) {
            template.loginStatus.set (loginStatus);
        }
        //log.info("filter-by-last-login-btn:loginStatus-local", loginStatus);
        //log.info("filter-by-last-login-btn:loginStatus-get", template.loginStatus.get());
        //template.connectStatus.set (template.$('#connectstatus'));

        //status-filter
        UsersStatusIndex.getComponentMethods().addProps('schoolNamespace', template.namespace);
        UsersStatusIndex.getComponentMethods().addProps('role', template.chosenRole.get());
        //UsersStatusIndex.getComponentMethods().addProps('connectStatus', template.connectStatus.get());
        UsersStatusIndex.getComponentMethods().addProps('loginStatus', template.loginStatus.get());
    }

});



