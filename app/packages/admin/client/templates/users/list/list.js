Template.AdminUsersSearch.helpers({
  doingOperations:function(){
   return Template.instance().doingOperations.get();   
  },
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
  },
  isUserChecked:function(){
      //console.log(this._id )
    //console.log(Template.instance().usersChecked.get());
    return (  Template.instance().usersChecked.get().indexOf(this._id) !== -1 ) ? "checked" : "";
  },
  totalUserCount:function(){
      return Meteor.users.find( {},{ fields:{ _id: 1} } ).count();
  },
  totalSelectUserCount:function(){
      return Template.instance().usersChecked.get().length;
  },
  showOptions:function(){
     return Template.instance().usersChecked.get().length > 0 ;
    
  }
});

Template.AdminUsersSearch.events({
    'click .school-directory-user-checkbox':function(event,template){
        
        if( $(event.target).prop('checked') ) {
           let latestArray = template.usersChecked.get();
           log.info($(event.target).val());
           latestArray.push( $(event.target).val() );
           
           template.usersChecked.set( latestArray  );            
        }else{
           let latestArray = template.usersChecked.get();
           log.info($(event.target).val());
           lodash.pull(latestArray, $(event.target).val());
                       
           template.usersChecked.set( latestArray  );              
        }

        
    },
    'click .remove-users-btn':function(event,template){
        let latestArray = template.usersChecked.get()
        let listOfUsers = latestArray.join('\n');
        if (window.confirm("Do you really want to remove the selected users?:\n"+listOfUsers)) { 
            //TODO
            //remove users from this school
           /* var groupId = $(event.target).data('newsgroupId');
            console.log('deleteNewsgroup',groupId);
            Meteor.call('smartix:newsgroups/deleteNewsgroup',groupId,function(){
                toastr.info('This newsgroup has been removed');
            });   */ 
        }          
    },
   'click .select-all-users-btn':function(event,template){
     var userObjects = Meteor.users.find( {},{ fields:{ _id: 1} } ).fetch();
     var userIds = lodash.map(userObjects,"_id");
     let latestArray = template.usersChecked.set(userIds);  
   },
   'click .select-all-users-current-page-btn':function(event,template){
      $('.school-directory-user-checkbox').each(function(index){
          if( $(this).prop('checked') ){
            //do nothing
          }else{
           let latestArray = template.usersChecked.get();
           log.info($(this).val());
           latestArray.push( $(this).val() );
           
           template.usersChecked.set( latestArray  );                
          }
      });
   },
   'click .deselect-all-users-current-page-btn':function(event,template){
      $('.school-directory-user-checkbox').each(function(index){
          if( $(this).prop('checked') ){
           let latestArray = template.usersChecked.get();
           log.info($(this).val());
           lodash.pull(latestArray, $(this).val());
                       
           template.usersChecked.set( latestArray  );                 
          }else{
            //do nothing
          }
      });
   },   
   'click .deselect-all-users-btn':function(event,template){
      template.usersChecked.set([]);
   },
    'click .add-users-to-role':function(event,template){
        let latestArray = template.usersChecked.get()
        let listOfUsers = latestArray.join('\n');
        var selectedRole = document.getElementById('selected-role').value;
        if (window.confirm("Do you really want to add role "+ selectedRole +" to the selected users?:\n"+listOfUsers)) {
            
            //show spinner
            template.doingOperations.set(true);
            
            Meteor.call('smartix:accounts-schools/assignSchoolRole',template.namespace,latestArray,selectedRole,function(){
                //hide spinner
                template.doingOperations.set(false);
            });
        }          
    },
    'click .remove-users-from-role':function(event,template){
        let latestArray = template.usersChecked.get()
        let listOfUsers = latestArray.join('\n');
        var selectedRole = document.getElementById('selected-role').value;        
        if (window.confirm("Do you really want to remove role "+ selectedRole +" from the selected users?:\n"+listOfUsers)) { 
            //show spinner
            template.doingOperations.set(true);            
            Meteor.call('smartix:accounts-schools/retractSchoolRole',template.namespace,latestArray,selectedRole,function(){
                //hide spinner
                template.doingOperations.set(false);                
            });
        }          
    },        
});
/*Template.SchoolUserListItem.helpers({
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
});*/

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
            self.namespace = schoolNamespace;
        }
    } else {
        log.info("Please specify a school to list the users for");
    }
    this.usersChecked = new ReactiveVar([]);
    this.doingOperations = new ReactiveVar(false);
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