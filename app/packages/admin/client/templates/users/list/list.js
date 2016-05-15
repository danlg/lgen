Template.AdminUsersSearch.helpers({
  getUserEmail:function(){
      if(this.emails){
       return this.emails[0].address;
      }
  },
  getUserRoles:function(){
      var schoolUsername = Router.current().params.school;
      var schoolNamespace = Smartix.Accounts.School.getNamespaceFromSchoolName(schoolUsername);
      
      if(schoolNamespace){
          if(this.roles)
          return this.roles[schoolNamespace].toString();
      }            

  },
  getCurrentSchoolName:function(){
      return Router.current().params.school;
  },
  getUserId:function(){
      return this._id;
  }
});

Template.SchoolUserListItem.helpers({
  getUserEmail:function(){
      if(this.emails){
       return this.emails[0].address;
      }
  },
  getUserRoles:function(){
      var schoolUsername = Router.current().params.school;
      var schoolNamespace = Smartix.Accounts.School.getNamespaceFromSchoolName(schoolUsername);
      
      if(schoolNamespace){
          if(this.roles)
          return this.roles[schoolNamespace].toString();
      }            

  },
  getCurrentSchoolName:function(){
      return Router.current().params.school;
  },
  getUserId:function(){
      return this._id;
  }
});

Template.SchoolUserListItem.onCreated(function(){

    SchoolUserPages.set({
        filters:{
            schools: 'zt6ezNMXLM4bWqsRW'
        }
    });
    
});

Template.SchoolUserList.helpers({
    getTotalUserCount:function(){
        return Meteor.users.find().count();
    }
});

Template.AdminUsersSearch.onCreated(function () {
    var self = this;
    if (Router
        && Router.current()
        && Router.current().params
        && Router.current().params.school
    ) {
        // subscribe to the school info first
        var schoolUsername = Router.current().params.school;
        log.info('packages/admin/client/template/users/list#schoolUsername: ' + schoolUsername);
        var schoolNamespace = Smartix.Accounts.School.getNamespaceFromSchoolName(schoolUsername)
        log.info('packages/admin/client/template/users/list#schoolNamespace: ' + schoolNamespace);
        
        if(schoolNamespace) {
            self.subscribe('smartix:accounts/allUsersInNamespace', schoolNamespace, function (err, res) {
                
            });
        }
    } else {
        log.info("Please specify a school to list the users for");
    }
});

Template.AdminUsersSearch.helpers({
  usersIndex: function () {
      if (Template.instance().subscriptionsReady()) {
        return UsersIndex;
      }
  },
  routeData: function () {
        if (Template.instance().subscriptionsReady()
            && Router
            && Router.current()) {
            return {
                uid: this._id,
                school: Router.current().params.school
            };
        }
    },
    userSearchInputAttributes: function () {
        return {
            placeholder: TAPi18n.__("Search"),
            class: "form-control",
            id: "AdminUsersSearchInput"
        }
    }
});