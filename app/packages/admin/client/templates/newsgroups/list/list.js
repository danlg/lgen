Template.AdminNewsgroupsSearch.onCreated(function () {
    var schoolName = UI._globalHelpers['getCurrentSchoolName']();
    if(schoolName)
    {
        let schoolId =  UI._globalHelpers['getCurrentSchoolId']();
        this.subscribe('smartix:newsgroups/allNewsgroupsFromSchoolId', schoolId);
        this.subscribe('smartix:distribution-lists/listsBySchoolId', schoolId);
        this.subscribe('smartix:accounts/allUsersInNamespace', schoolId);
    }
    this.usersChecked = new ReactiveVar([]);
    this.doingOperations = new ReactiveVar(false);  
    this.modalName = new ReactiveVar("remove-newsgroups-modal");
    this.modalTitle = new ReactiveVar("Do you really want to remove the selected newsgroups? ?");
    this.modalBody = new ReactiveVar("");    
});

Template.AdminNewsgroupsSearch.helpers({
  currentSchoolName:function(){
      return UI._globalHelpers['getCurrentSchoolName']()
  },
  newsgroupsIndex: function () {
      return NewsgroupsIndex;
  },
  routeData: function () {
    return {
        code: this.url,
        school: UI._globalHelpers['getCurrentSchoolName']()
    };
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
    
  },
  userData: function (data) {
        if(Template.instance().subscriptionsReady()) {
            return Meteor.users.findOne({
                _id: data
            });
        }
  },
  distributionListData :function(data){
    //   log.info('distributionListData',
    //     Smartix.Groups.Collection.findOne({_id: data
    //    })     );
      return Smartix.Groups.Collection.findOne({
          _id: data
      });
  },
  newsgroupSearchInputAttributes: function () {
      return {
          placeholder: TAPi18n.__("Search"),
          class: "form-control",
          id: "newsgroupSearchInput"
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

Template.AdminNewsgroupsSearch.events({
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
     var userObjects = Smartix.Groups.Collection.find({type:'newsgroup'},{ fields:{ _id: 1} } ).fetch();
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
        let listOfNewsgroups = Smartix.Groups.Collection.find({_id:{$in: latestArray }}).fetch();
        let listOfNewsgroupsNames = listOfNewsgroups.map(function(eachNewsgroupObj){
            return eachNewsgroupObj.name;
        });
        template.modalBody.set(listOfNewsgroupsNames.join('<br/>'));
        Meteor.setTimeout(function(){
           $('#remove-newsgroups-modal-btn').click();  
        },200);
   },
    'click .modal .save':function(event,template){
        if( $(event.target).hasClass('remove-newsgroups-modal') ){
            let latestArray = template.usersChecked.get();
            //show spinner
            template.doingOperations.set(true);          
            //hide modal
            $('.modal .close').click();      
            //call method to delete newsgroups
            Meteor.call('smartix:newsgroups/deleteNewsgroups',latestArray,function(){
                //when finished:
                //hide spinner
                template.doingOperations.set(false);          
                //un-select all newsgroups
                template.usersChecked.set([]);             
            });            
        }
    },
});