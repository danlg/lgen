Template.AdminClassesSearch.onCreated(function () {
    if (Router
    && Router.current()
    && Router.current().params
    && Router.current().params.school
    ) {
        this.subscribe('smartix:classes/allClassesFromSchoolName', Router.current().params.school);

        var schoolNamespace = Smartix.Accounts.School.getNamespaceFromSchoolName(Router.current().params.school);
        this.subscribe('smartix:accounts/allUsersInNamespace', schoolNamespace);        
    } else {
        log.info("Please specify a school to list the classes for");
    }
    this.usersChecked = new ReactiveVar([]);
    this.doingOperations = new ReactiveVar(false);     
});

Template.AdminClassesSearch.helpers({
  classesIndex: function () {
      return ClassesIndex;
  },
  routeData: function () {
        if (Router && Router.current()) {
            return {
                classCode: this.classCode,
                school: Router.current().params.school
            };
        }
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
    
  },
  userData: function (data) {
        if(Template.instance().subscriptionsReady()) {
            return Meteor.users.findOne({
                _id: data
            });
        }
  }
});

Template.AdminClassesSearch.events({
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
     var userObjects = Smartix.Groups.Collection.find( {},{ fields:{ _id: 1} } ).fetch();
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
   'click .remove-distribution-lists-btn':function(event,template){
        let latestArray = template.usersChecked.get();
        let listOfUsers = latestArray.join('\n');
        if (window.confirm("Do you really want to remove the selected class(es):\n"+listOfUsers)) {             
            latestArray.map(function(eachDistributionListId){
                Meteor.call('smartix:distribution-lists/remove',eachDistributionListId);            
            });
            template.usersChecked.set([]); 
        }             
   }
});