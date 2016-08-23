Template.AdminDistributionListView.onCreated(function () {
    var schoolName = UI._globalHelpers['getCurrentSchoolName']();
    var currentCode = Router.current().params.code;
    var self = this;
    this.subscribe('schoolInfo', schoolName, function (err, res) {
        var schoolId = UI._globalHelpers['getCurrentSchoolId']();
        self.namespace = schoolId;
        self.subscribe('smartix:distribution-lists/listByCode', currentCode);
        self.subscribe('smartix:accounts/basicInfoOfAllUsersInNamespace', schoolId);
    });
    this.usersChecked = new ReactiveVar([]);
    this.doingOperations = new ReactiveVar(false);
});

Template.AdminDistributionListView.helpers({
    listData: function () {
        return Smartix.Groups.Collection.findOne({
            url: Router.current().params.code,
            type: 'distributionList'
        })
    },
    userData: function(data) {
        return Meteor.users.findOne({
            _id: data
        });
    },
    distributionListUsersIndex: function () {
        return DistributionListUsersIndex;
    },
    adminUserSearchInputAttributes: function () {
        return {
            placeholder: TAPi18n.__("Search"),
            class: "form-control",
            id: "AdminDistributionListView__add-user-input"
        }
    },
    doingOperations:function(){
    return Template.instance().doingOperations.get();   
    },
    getUserEmail:function(){
        if(this.emails){
            if(this.emails.length>0)
                return this.emails[0].address;
        }
        else return "";
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
    },
    isUserChecked:function(){
        //log.info(this._id )
        //log.info(Template.instance().usersChecked.get());
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
            toastr.info(listOfUserNames.toString() +' '+ TAPi18n.__("Admin.AddSuccess"));
            // console.log(err);
            // console.log(res);
        })               
    },
    
    'click .remove-users-from-distribution-list':function(event,template){
        let userIdsToRemove = template.usersChecked.get();
        let listOfUsers = Meteor.users.find({_id:{$in: userIdsToRemove }}).fetch();
        var currentList = Router.current().params.code;     
        let listOfUserNames = listOfUsers.map(function(eachUserObj){
            return eachUserObj.profile.firstName + " " + eachUserObj.profile.lastName;
        });
        Meteor.call('smartix:distribution-lists/removeUsersByListName', currentList, userIdsToRemove, function (err, res) {
            toastr.info(listOfUserNames.toString() + ' ' + TAPi18n.__("Admin.RemoveSuccess"));            
            // console.log(err);
            // console.log(res);
        })
    },
    
    'click .school-directory-user-checkbox':function(event,template){
        
        if( $(event.target).prop('checked') ) {
           let latestArray = template.usersChecked.get();
           //log.info($(event.target).val());
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
     var userObjects;
     if (selectedRole) {
         if(selectedRole === 'all'){
              toastr.info(TAPi18n.__("Admin.AllUsersAreSelected"));
         }else{
              toastr.info(TAPi18n.__("Admin.All")+ ' '+ TAPi18n.__(selectedRole) + TAPi18n.__("Admin.AreSelected"));
         }
         let searchString = DistributionListUsersIndex.getComponentDict().keys.searchDefinition;
         //remove wrapping double quote
         searchString = searchString.replace(/"/g,"");
         //log.info(searchString);
         userObjects = DistributionListUsersIndex.search( searchString, { limit: 999999, props: { schoolNamespace: template.namespace, role: selectedRole } }).fetch();
         //log.info(userObjects);
       } else {
         toastr.info(TAPi18n.__("Admin.AllUsersAreSelected"));
      
         let searchString = DistributionListUsersIndex.getComponentDict().keys.searchDefinition;
         //remove wrapping double quote                  
         searchString = searchString.replace(/"/g,"");
         
         //log.info(searchString);
         userObjects = DistributionListUsersIndex.search( searchString , { limit: 999999 }).fetch();
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
   },
   
   'click #UpdateListName_submit': function(event, template)
    {
        event.preventDefault();
        // Create new object to store info
        var newListObj = {};
        var currentList = Router.current().params.code;     
        newListObj.name = template.$('#updateListName-name').eq(0).val();
        Meteor.call('smartix:distribution-lists/edit', currentList, newListObj, function(err,res){
            if(!err)
            {
                toastr.success(TAPi18n.__('Success'));
            }
            else{
                toastr.error(err.reason);
            }
        })
    }
});