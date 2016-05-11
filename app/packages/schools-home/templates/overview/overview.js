Template.MobileSchoolHome.helpers({
   
    schoolLogoUrl:function(){
        var schoolLogoId;
        
        var schoolDoc = SmartixSchoolsCol.findOne({                                                    
            username: Router.current().params.school                                                                     
        });
        
        //console.log('schoolDoc',schoolDoc);
        if(schoolDoc) {
            schoolLogoId = schoolDoc.logo;
        
        }
        //console.log(schoolLogoId);
        
        return Images.findOne(schoolLogoId);
    },
    
    schoolFullName:function(){
        var schoolLogoId;
        
        var schoolDoc = SmartixSchoolsCol.findOne({                                                    
            username: Router.current().params.school                                                                     
        });
        
        if(schoolDoc){
         return schoolDoc.name;             
        }
      
    },
    getCurrentSchoolName: function() {
        return Router.current().params.school;
    },
    getSlidingNews:function(){
        var newsgroupsIds = [];
        
        
        var newsgroupsByUserArray =  Smartix.Groups.Collection.find({ type: 'newsgroup', users: Meteor.userId() }).fetch(); 
        var newsgroupsByUserArrayIds = lodash.map(newsgroupsByUserArray,'_id');
        
        var distributionListsUserBelong = Smartix.Groups.Collection.find({type: 'distributionList', users: Meteor.userId() }).fetch();
        var distributionListsUserBelongIds = lodash.map(distributionListsUserBelong,'_id');
        
        //console.log('distributionListsUserBelongIds',distributionListsUserBelongIds);
        
        var newsgroupsBydistributionLists =  Smartix.Groups.Collection.find({ type: 'newsgroup', distributionLists: {$in : distributionListsUserBelongIds } , optOutUsersFromDistributionLists :{  $nin : [Meteor.userId()] } }).fetch();      
        var newsgroupsBydistributionListsIds = lodash.map(newsgroupsBydistributionLists,'_id');
        
        //console.log('newsgroupsBydistributionListsIds',newsgroupsBydistributionListsIds);
        
        newsgroupsIds = newsgroupsIds.concat(newsgroupsByUserArrayIds,newsgroupsBydistributionListsIds);
        
        //console.log('newsgroupsIds',newsgroupsIds);
        
        Template.instance().canGetSlidNews.set(true);
        
        return Smartix.Messages.Collection.find({$or:[
            {
                group: { $in: newsgroupsIds },
                hidden : false,
                deletedAt:"",

            },
            {
                group: { $in: newsgroupsIds },
                hidden: false,
                deletedAt: { $exists: false },
                 
            }
        ]}
        , {sort: {createdAt: -1 }, reactive: false }
        );  
                

          




    }
    
    
});

Template.MobileSchoolHome.onDestroyed(function(){
   
   this.canGetSlidNews = new ReactiveVar(false);
     
})

Template.MobileSchoolHome.onCreated(function(){
   
   this.canGetSlidNews = new ReactiveVar(false);
   var self = this;
   self.subscribe('newsgroupsForUser',null,null, Router.current().params.school,function(){
    self.subscribe('newsForUser',null,null, Router.current().params.school);       
   });
     

})

Template.MobileSchoolHome.onRendered(function(){
    var self = this;


    self.autorun(function(){
        if(self.canGetSlidNews.get()){
            self.$('.ion-slide-box').slick({
                infinite: true,
                autoplay: true,
                autoplaySpeed: 4000,
                arrows: false,
                dots: false,
                dotsClass: 'slider-pager',
                initialSlide: 0,
                customPaging: function(slider, i) {
                return '<span class="slider-pager-page icon ion-record"></span>';
                }
            });            
        }
    })
        

  




})

Template.MobileSchoolHome.onDestroyed(function(){   


})