Template.AdminDistributionListsSearch.onCreated(function () {

    let schoolId = UI._globalHelpers['getCurrentSchoolId']()
    if(schoolId){
        this.subscribe('smartix:distribution-lists/listsBySchoolId', schoolId);
        this.subscribe('smartix:accounts/allUsersInNamespace', schoolId);
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
   'click .clone-distribution-lists-btn': function(event, template)
   {
        let latestArray = template.usersChecked.get();
        if(latestArray.length > 1)
        {
            toastr.error(TAPi18n.__("Admin.CloneListError"));
        }
        else{
            let listToClone = Smartix.Groups.Collection.findOne(latestArray[0]);
            template.modalName.set("clone-distribution-lists-modal");
            let title = TAPi18n.__("Admin.DuplicateDistributionList");
            template.modalTitle.set(title + " : " + listToClone.name);
            template.modalBody.set('<input id="cloneDistributionList-name" type="text" class="form-control" value="'+listToClone.name+' (2)">');  
            Meteor.setTimeout(function(){
                $('#clone-distribution-lists-modal-btn').click();  
            },200); 
        }
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
       else if( $(event.target).hasClass('clone-distribution-lists-modal'))
       {
            let latestArray = template.usersChecked.get();
            let newName = $('#cloneDistributionList-name').eq(0).val();
            Meteor.call('smartix:distribution-lists/duplicate', latestArray[0], newName, function(error, result){
                if(!error)
                {
                    toastr.info(TAPi18n.__("Admin.CloneListSuccess"));
                }
                else{
                    toastr.info(error.reason);
                }
            });
            $('.modal .close').click();
       }
    },
});