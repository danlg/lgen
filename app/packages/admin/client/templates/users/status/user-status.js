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
            this.subscribe('ALLUsersRelationships', Meteor.userId(), this.namespace, function (err, res) {
                if(!err) {
                    self.parentMap.set( buildParentMap());
                    //this.parentMap = self.parentMap;
                    //buildParentMap(self);
                    if (self.parentMap) {
                        log.info("parentmap.size-oncreated-SELF-IN", Object.keys(self.parentMap.get()).length);
                    }else {
                        log.info("parentmap.size-oncreated-SELF-IN-NULL");
                    }
                   }
                // else log.error("cannot build parent map");
            });
            log.info("here1");
            if (self.parentMap.get()) {
                log.info("parentmap.size-oncreated-SELF", Object.keys(self.parentMap.get()).length);
            }else {
                log.info("parentmap.size-oncreated-SELF-NULL");
            }
            if (this.parentMap.get()) {
                log.info("parentmap.size-oncreated-THIS", Object.keys(this.parentMap.get()).length);
            }else {
                log.info("parentmap.size-oncreated-THIS-NULL");
            }
        }
    } else {
        log.info("Please specify a school to list the users for");
    }
    //this.parentMap = self.parentMap;
    this.modalName = new ReactiveVar("");
    this.modalTitle = new ReactiveVar("");
    this.modalBody = new ReactiveVar("");
    this.chosenRole = new ReactiveVar("all");
    //this.connectStatus = new ReactiveVar("allconnection");
    this.loginStatus = new ReactiveVar("anyLoggedIn");
});

var buildParentMap = () => {
    let relationshipCursor = Smartix.Accounts.Relationships.Collection.find();
    let parentMapTmp = {};
    relationshipCursor.forEach((relation) => {
        let value = {};
        value.classrooms = findClassroom(relation.child);
        value.grades = findGrade(relation.child);//todo changeme
        if (relation.parent ==="xfoofdTL3z9dsx8Lp"){
            log.info("findUser", findUser(relation.parent) ,"=",  findUser(relation.child));
        }
        parentMapTmp [relation.parent] = value;
        if (relation.parent ==="xfoofdTL3z9dsx8Lp"){
            log.info("findUserFOUND",  parentMapTmp [relation.parent]);
            log.info("findUserFOUND.cs",  parentMapTmp [relation.parent].classrooms);
        }
    });
    log.info("parentmap.size-IMPL", Object.keys(parentMapTmp).length);
    //log.info("parentmap", parentMap);
    return parentMapTmp;
};
var findUser = (uid) => {
    let user = Meteor.users.findOne({_id: uid});
    if (user) {
        return user;
    }
    // else {  log.info("Cannot find user ", uid); }
};
var findClassroom = (uid) => {
    let user = Meteor.users.findOne({_id: uid});
    if (user) {
        if (user.classroom) {
            return user.classroom;
        }
    }
    // else { log.info("Cannot find classroom for user ", uid);}
};
var findGrade = (uid) => {
    let user = Meteor.users.findOne({_id: uid});
    if (user) {
        if (user.grade) {
            return user.grade;
        }
    }
    // else {     log.info("Cannot find grade for user ", uid); }
};
/**
 * @param parentUserId
 * @returns an object containing the parent's children classroom and grades
 */
// var lookupStudentDetail = (parentUserId) => {
//     if(Template.instance().subscriptionsReady()) {
//         //1. find children
//
//         //2. find classroom of the child
//         let classroomArray = [];
//         let gradeArray = [];
//         return {
//             classrooms : classroomArray,
//             grades :     gradeArray
//         };
//     }
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

    getClassroom:(uid) => {
        let parentMapH =  Template.instance().parentMap.get();
        // if (Template.instance() && Template.instance().parentMap) {
        //     log.info("parentmap.size-GET-11111", Object.keys(Template.instance().parentMap.get()).length);
        // }else {
        //     log.info("parentmap.size-GET-11111-KO)))");
        //     log.info("parentmap.size-GET-22222-KO)))", Template.instance().parentMap);
        // }
        if (parentMapH) {
            log.info("parentmap.size-GET-PM-11111", Object.keys(parentMapH).length);
        }else {
            log.info("parentmap.size-GET-PM-11111-KO)))");
            log.info("parentmap.size-GET-PM-22222-KO)))", parentMapH);
        }
        let user =  Meteor.users.findOne({ _id: uid});
        let namespace = UI._globalHelpers['getCurrentSchoolId']();
        if (uid ==="xfoofdTL3z9dsx8Lp") {
            log.info("getClassroom.value", findUser(uid) ,"=",   user);
        }
        if (user.classroom) {
            return user.classroom;
        }
        else{ //this is a parent, admin
            if (Roles.userIsInRole(uid, Smartix.Accounts.School.PARENT, namespace) ) {
                if (uid ==="xfoofdTL3z9dsx8Lp"){
                    log.info("getClassroom.value", findUser(uid) );
                    log.info("parentmap.size-GET");
                    if (Template.instance().parentMap.get()) {
                        log.info("parentmap.size-GET.OK", Object.keys(Template.instance().parentMap.get()).length);
                    } else{
                        log.info("parentmap.size-GET.KO", Template.instance().parentMap);
                    }
                    log.info("getClassroom.value", findUser(uid) ,"=",   parentMapH [uid]);
                    let classrooms = parentMapH [uid].classrooms;
                    log.info("getClassroom.classrooms", findUser(uid) ,"=",  classrooms);
                }
                if (parentMapH [uid]){
                    let classrooms = parentMapH [uid].classrooms;
                    return classrooms;
                }
            }
            else {
                if (uid ==="xfoofdTL3z9dsx8Lp") {
                    log.warn ("cannot find parent", namespace);
                }
                return  "";
            }
        }
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



