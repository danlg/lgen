Template.AdminDistributionListView.onCreated(function () {
    var self = this;
    if(Router.current()
    && Router.current().params
    && Router.current().params.code) {
        var currentCode = Router.current().params.code;
        var schoolName = Router.current().params.school;
        self.subscribe('schoolInfo', schoolName, function (err, res) {
            var schoolId = Smartix.Accounts.School.getNamespaceFromSchoolName(schoolName);
            self.namespace = schoolId;
            self.subscribe('smartix:distribution-lists/listByCode', currentCode, function (error, res) {
                self.subscribe('smartix:accounts/basicInfoOfAllUsersInNamespace', schoolId, function (err, res) {
                    
                });
                
                // if(!error) {
                //     var listData = Smartix.Groups.Collection.findOne({
                //         url: currentCode,
                //         type: 'distributionList'
                //     });
                    
                //     // if(listData && listData._id) {
                //     //     self.subscribe('smartix:messages/groupMessages', listData._id);
                //     // }
                // }
            });
        });
    }
    
    this.usersChecked = new ReactiveVar([]);
    this.doingOperations = new ReactiveVar(false);
});

Template.AdminDistributionListView.helpers({
    listData: function () {
        if(Template.instance().subscriptionsReady()) {
            return Smartix.Groups.Collection.findOne({
                url: Router.current().params.code,
                type: 'distributionList'
            });
        }
    },
    userData: function (data) {
        if(Template.instance().subscriptionsReady()) {
            return Meteor.users.findOne({
                _id: data
            });
        }
    },
    distributionListUsersIndex: function () {
        return DistributionListUsersIndex;
    },
    adminUserSearchInputAttributes: function () {
        return {
            placeholder: "Type the name of your new admin",
            class: "form-control",
            id: "AdminDistributionListView__add-user-input"
        }
    },
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

Template.AdminDistributionListView.events({
    'click .AdminDistributionListView__user-search-result': function (event, template) {
        
        var userToAdd = event.currentTarget.dataset.userId;
        var currentList;
        if(Router.current()
        && Router.current().params
        && Router.current().params.code) {
            currentList = Router.current().params.code;
        }
        
        if(userToAdd && currentList) {
            Meteor.call('smartix:distribution-lists/addUsersByListName', currentList, [userToAdd], function (err, res) {
                // console.log(err);
                // console.log(res);
            })
        }
    },
    'click .AdminDistributionListView__remove-user': function (event, template) {
        
        var userToRemove = event.currentTarget.dataset.userId;
        var currentList;
        if(Router.current()
        && Router.current().params
        && Router.current().params.code) {
            currentList = Router.current().params.code;
        }
        
        if(userToRemove && currentList) {
            Meteor.call('smartix:distribution-lists/removeUsersByListName', currentList, [userToRemove], function (err, res) {
                // console.log(err);
                // console.log(res);
            })
        }
    },
    'click .add-users-to-distribution-list':function(event,template){
        let userIdsToAdd = template.usersChecked.get()
        let listOfUsers = Meteor.users.find({_id:{$in: userIdsToAdd }}).fetch();
        var currentList = Router.current().params.code;       
        let listOfUserNames = listOfUsers.map(function(eachUserObj){
            return eachUserObj.profile.firstName + " " + eachUserObj.profile.lastName;
        });

        Meteor.call('smartix:distribution-lists/addUsersByListName', currentList, userIdsToAdd, function (err, res) {
            toastr.info(listOfUserNames.toString() + ' added to distributionList');
            // console.log(err);
            // console.log(res);
        })               
    },
    'click .remove-users-from-distribution-list':function(event,template){
        let userIdsToRemove = template.usersChecked.get()
     
        let listOfUsers = Meteor.users.find({_id:{$in: userIdsToRemove }}).fetch();
        var currentList = Router.current().params.code;     
        let listOfUserNames = listOfUsers.map(function(eachUserObj){
            return eachUserObj.profile.firstName + " " + eachUserObj.profile.lastName;
        })
        
        Meteor.call('smartix:distribution-lists/removeUsersByListName', currentList, userIdsToRemove, function (err, res) {
            toastr.info(listOfUserNames.toString() + ' removed from distributionList');            
            // console.log(err);
            // console.log(res);
        })        
      
    },    
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
   'click .select-all-users-btn':function(event,template){
     
     var selectedRole = $('input[name="filter-by-role"]:checked').val();
     var userObjects
     if (selectedRole) {
         if(selectedRole === 'all'){
              toastr.info('All users are selected');
         }else{
              toastr.info('All '+selectedRole+ ' are selected');
         }
         userObjects = DistributionListUsersIndex.search('', { limit: 999999, props: { schoolNamespace: template.namespace, role: selectedRole } }).fetch();
     } else {
         toastr.info('All users are selected');
         userObjects = DistributionListUsersIndex.search('', { limit: 999999 }).fetch();
     }
     
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
   'click .filter-by-role':function(event,template){
       var chosenRole =  $(event.target).val();
        DistributionListUsersIndex.getComponentMethods().addProps('schoolNamespace', template.namespace);
        DistributionListUsersIndex.getComponentMethods().addProps('role', chosenRole);
        
        //if user change filter by role, we need to clear the list so that users not in selected role would not be selected
        template.usersChecked.set([]);
        
        //https://github.com/matteodem/meteor-easy-search/issues/440
        //we also need to take user back to the first page of results
        DistributionListUsersIndex.getComponentDict().set('currentPage', 1);
        DistributionListUsersIndex.getComponentMethods().paginate(1);          
   }      
});