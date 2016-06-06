 Template.MobileSchoolHomeFake.helpers({
    needMaskImageFallback:function(){
       //log.info('needMaskImageFallback');
      return (document.documentElement.style['-webkit-mask-image'] !== undefined) ? "" : "mask-image-fallback"
    } 
 });

