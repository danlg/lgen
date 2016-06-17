Template.AdminDistributionListsSearch.onCreated(function () {
    
    var schoolNamespace = UI._globalHelpers['getCurrentSchoolId']();
    if (schoolNamespace) {
        this.subscribe('smartix:distribution-lists/listsBySchoolName', UI._globalHelpers['getCurrentSchoolName']());
        this.subscribe('smartix:accounts/allUsersInNamespace', schoolNamespace);
    } else {
        log.info("Please specify a school to list the classes for");
    }
    this.usersChecked = new ReactiveVar([]);
    this.doingOperations = new ReactiveVar(false);    
    this.modalName = new ReactiveVar("remove-distribution-lists-modal");
    this.modalTitle = new ReactiveVar("Do you really want to remove the selected distribution list(s)?");
    this.modalBody = new ReactiveVar("");      
});

Template.AdminDistributionListsSearch.helpers({
  distributionListIndex: function () {
      return DistributionListIndex;
  },
  routeData: function () {
        if (Router && Router.current()) {
            return {
                code: this.url,
                school: Router.current().params.school
            };
        }
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
      return Template.instance().usersChecked.get().length > 0;

  },
  userData: function (data) {
      if (Template.instance().subscriptionsReady()) {
          return Meteor.users.findOne({
              _id: data
          });
      }
  },
  distSearchInputAttributes: function () {
      return {
          placeholder: TAPi18n.__("Search"),
          class: "form-control",
          id: "DistListSearchInput"
      }
  },
  getModalName: function () {
      return Template.instance().modalName.get();
  },
  getModalTitle: function () {
      return Template.instance().modalTitle.get();
  },
  getModalBody: function () {
      return Template.instance().modalBody.get();
  }
});

Template.AdminDistributionListsSearch.events({
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
        let listOfDistributionlists = Smartix.Groups.Collection.find({_id:{$in: latestArray }}).fetch();
        let listOfDistributionlistsNames = listOfDistributionlists.map(function(eachDistributionListObj){
            return eachDistributionListObj.name;
        })        

        template.modalBody.set(listOfDistributionlistsNames.join('<br/>'));

        Meteor.setTimeout(function(){
           $('#remove-distribution-lists-modal-btn').click();  
        },200);          
        /*let listOfUsers = latestArray.join('\n');
        if (window.confirm("Do you really want to remove the selected distribution lists?:\n"+listOfUsers)) {             
            latestArray.map(function(eachDistributionListId){
                Meteor.call('smartix:distribution-lists/remove',eachDistributionListId);            
            });
            template.usersChecked.set([]); 
        }*/           
   },
    'click .modal .save':function(event,template){
        if( $(event.target).hasClass('remove-distribution-lists-modal') ){
            let latestArray = template.usersChecked.get();
         
            //hide modal
            $('.modal .close').click();
                  
            //call method to delete distribution lists
            latestArray.map(function(eachDistributionListId){
                Meteor.call('smartix:distribution-lists/remove',eachDistributionListId);            
            });           
        }
    },
});