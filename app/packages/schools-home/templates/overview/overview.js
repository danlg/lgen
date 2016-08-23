Template.MobileSchoolHome.onCreated(function(){
    this.canGetSlidNews = new ReactiveVar(false);
    var self = this;
    var schoolName =  UI._globalHelpers['getCurrentSchoolName']();
    if(schoolName)
    {
        // self.subscribe('newsgroupsForUser',null,null, schoolName);
        self.subscribe('newsForUser',null,null, schoolName);
        self.subscribe('images', schoolName, 'school', schoolName);
    }
    //this.autorun()
});

Template.MobileSchoolHome.helpers({
    toUpperI18N:function(key) {
        return TAPi18n.__(key).toUpperCase();
    },

    schoolLogoUrl:function(){
        var schoolDoc = SmartixSchoolsCol.findOne({
            shortname: UI._globalHelpers['getCurrentSchoolName']()
        });        //log.info('schoolDoc',schoolDoc);
        var schoolLogoId;
        if(schoolDoc) {
            schoolLogoId = schoolDoc.logo;
        }
        //log.info(schoolLogoId);
        return Images.findOne(schoolLogoId);
    },

    getSlidingNews:function(){
        Template.instance().canGetSlidNews.set(true);
        return Smartix.Messages.Collection.find({}, 
            {sort: {createdAt: -1 }, reactive: false }
            ); 
    },
    
    needMaskImageFallback:function(){
      return (document.documentElement.style['-webkit-mask-image'] !== undefined) ? "" : "mask-image-fallback"
    },

    getSchoolBannerBackground:function(){
        var schoolBackgroundImageId;
        var schoolDoc = SmartixSchoolsCol.findOne({
            shortname: UI._globalHelpers['getCurrentSchoolName']()
        });
        var customStyle;
        if(schoolDoc) {
            schoolBackgroundImageId = schoolDoc.backgroundImage;
        }
        //log.info('schoolBackgroundImageId',schoolBackgroundImageId);
        //log.info(schoolLogoId);
        if(schoolBackgroundImageId){
            var  bgObj =  Images.findOne(schoolBackgroundImageId);
            //log.info('bgObj',bgObj);

             customStyle = `
                                <style>                        
                                    .school-banner-wrapper .school-banner-background{
                                    background-image: url('${bgObj.url()}');
                                    }                                                                    
                                </style>
                            `;
        }else{
             customStyle = `
                                <style>                        
                                    .school-banner-wrapper .school-banner-background{
                                    background-image: url('/img/graduation_ceremony_picture@1x.jpg');
                                    }                                                                    
                                </style>
                            `;
        }


        return customStyle;
    },
    customizeTheme: function() {
        
        /*
        var pickSchool = SmartixSchoolsCol.findOne(Session.get('pickedSchoolId'));

        if (!pickSchool) {
            return "";
        }

        if (pickSchool.preferences.schoolBackgroundColor && pickSchool.preferences.schoolTextColor) {
            var schoolBackgroundColor = pickSchool.preferences.schoolBackgroundColor;
            var schoolTextColor = pickSchool.preferences.schoolTextColor;
            if (schoolBackgroundColor && schoolTextColor) {
                var customStyle = `
                                    <style>                        
                                         .school-logo-wrapper .school-logo img{
                                              border: 3px solid ${schoolBackgroundColor};
                                         }                                                                        
                                    </style>
                                `;

                return customStyle;
            } else {
                return "";
            }
        } else {
            return "";
        }*/


    },
    
    
});

Template.MobileSchoolHome.onDestroyed(function(){
   this.canGetSlidNews = new ReactiveVar(false);
});

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