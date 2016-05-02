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
        var newsgroups =  Smartix.Groups.Collection.find({ type: 'newsgroup' }).fetch();
        //console.log('getSlidingNews:',newsgroups);
        var newsgroupsIds = lodash.map(newsgroups,'_id');        
        var messages = Smartix.Messages.Collection.find({ group: { $in: newsgroupsIds } }, {sort: {createdAt: -1 } } );        
        //console.log('getSlidingNews:', messages);
        if(messages.count()>0){
            Template.instance().slidingNewsLoaded.set(true);
        }
        return messages;
    }
    
    
});

Template.MobileSchoolHome.onCreated(function(){
   var self = this;
   self.subscribe('newsgroupsForUser',null,null, Router.current().params.school,function(){
    self.subscribe('newsForUser',null,null, Router.current().params.school );       
   });
   
   this.slidingNewsLoaded = new ReactiveVar(false);

})

Template.MobileSchoolHome.onRendered(function(){

 var self = this;
 self.autorun(function(){    
  if(self.slidingNewsLoaded.get()){
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