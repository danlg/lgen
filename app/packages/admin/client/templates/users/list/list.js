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
          let role = "";
          if(this.roles) {
              //tod this more clever
              role = this.roles[schoolNamespace].toString();
              if (role === "student") { role = "Student" }
              if (role === "parent") { role = "Parent" }
              if (role === "teacher") { role = "Teacher" }
              if (role === "admin") { role = "Admin" }
          }
          return role;
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
        let latestArray = template.usersChecked.get();
        if(latestArray.indexOf(Meteor.userId()) > -1){
            toastr.info('Please deselect your own account first. You cannot remove your account');
            return;
        }
        let listOfUsers = Meteor.users.find({_id:{$in: latestArray }}).fetch();
        let listOfUserNames = listOfUsers.map(function(eachUserObj){
            return eachUserObj.profile.firstName + " " + eachUserObj.profile.lastName;
        })
        template.modalTitle.set('Do you really want to remove the selected users?');
        template.modalBody.set(listOfUserNames.join('<br/>'));
        template.modalName.set('remove-users-modal');
        Meteor.setTimeout(function(){
           $('#remove-users-modal-btn').click();  
        },200);    
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
        let listOfUsers = Meteor.users.find({_id:{$in: latestArray }}).fetch();
        var selectedRole = document.getElementById('selected-role').value;        
        let listOfUserNames = listOfUsers.map(function(eachUserObj){
            return eachUserObj.profile.firstName + " " + eachUserObj.profile.lastName;
        })
        template.modalTitle.set("Do you really want to add role "+ selectedRole +" to the selected users?");
        template.modalBody.set(listOfUserNames.join('<br/>'));
        template.modalName.set('add-users-to-role-modal');
        Meteor.setTimeout(function(){
           $('#add-users-to-role-modal-btn').click();  
        },200); 
                
        /*
        if (window.confirm("Do you really want to add role "+ selectedRole +" to the selected users?:\n"+listOfUsers)) {
            
            //show spinner
            template.doingOperations.set(true);
            
            Meteor.call('smartix:accounts-schools/assignSchoolRole',template.namespace,latestArray,selectedRole,function(){
                //hide spinner
                template.doingOperations.set(false);
            });
        }*/         
    },
    'click .remove-users-from-role':function(event,template){
        let latestArray = template.usersChecked.get()
     
        if(latestArray.indexOf(Meteor.userId()) > -1 && selectedRole === 'admin'){
            toastr.info('You cannot remove your admin role');
            return;
        }

        let listOfUsers = Meteor.users.find({_id:{$in: latestArray }}).fetch();
        var selectedRole = document.getElementById('selected-role').value;
        let listOfUserNames = listOfUsers.map(function(eachUserObj){
            return eachUserObj.profile.firstName + " " + eachUserObj.profile.lastName;
        })
        template.modalTitle.set("Do you really want to remove role "+ selectedRole +" from the selected users?");
        template.modalBody.set(listOfUserNames.join('<br/>'));
        template.modalName.set('remove-users-from-role-modal');
        Meteor.setTimeout(function(){
           $('#remove-users-from-role-modal-btn').click();  
        },200); 
                             
        /*if (window.confirm("Do you really want to remove role "+ selectedRole +" from the selected users?:\n"+listOfUsers)) { 
            //show spinner
            template.doingOperations.set(true);            
            Meteor.call('smartix:accounts-schools/retractSchoolRole',template.namespace,latestArray,selectedRole,function(){
                //hide spinner
                template.doingOperations.set(false);                
            });
        }*/      
    },
    'click .modal .save':function(event,template){
        if( $(event.target).hasClass('remove-users-modal') ){
            let latestArray = template.usersChecked.get();
            //show spinner
            template.doingOperations.set(true);          
            //hide modal
            $('.modal .close').click();      
            //call method to delete users
            Meteor.call('smartix:accounts-schools/deleteSchoolUsers',template.namespace,latestArray,function(){
                //when finished:
                //hide spinner
                template.doingOperations.set(false);          
                //un-select all users
                template.usersChecked.set([]);             
            });            
        }else if( $(event.target).hasClass('add-users-to-role-modal') ){
            var selectedRole = document.getElementById('selected-role').value;               
            let latestArray = template.usersChecked.get();
            //show spinner
            template.doingOperations.set(true);          
            //hide modal
            $('.modal .close').click();        
            //call method to add users to role
            Meteor.call('smartix:accounts-schools/assignSchoolRole',template.namespace,latestArray,selectedRole,function(){
                //hide spinner
                template.doingOperations.set(false);
            });                  
        }else if( $(event.target).hasClass('remove-users-from-role-modal')  ){
            var selectedRole = document.getElementById('selected-role').value;               
            let latestArray = template.usersChecked.get();
            //show spinner
            template.doingOperations.set(true);          
            //hide modal
            $('.modal .close').click();
              
            //call method to remove users from role
            Meteor.call('smartix:accounts-schools/retractSchoolRole',template.namespace,latestArray,selectedRole,function(){
                //hide spinner
                template.doingOperations.set(false);
            });                       
        }
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
            self.namespace = schoolNamespace;
        }
    } else {
        log.info("Please specify a school to list the users for");
    }
    this.usersChecked = new ReactiveVar([]);
    this.doingOperations = new ReactiveVar(false);
    this.modalName = new ReactiveVar("");
    this.modalTitle = new ReactiveVar("");
    this.modalBody = new ReactiveVar("");
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