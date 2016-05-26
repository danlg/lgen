 Template.MobileSchoolHomeFake.helpers({
    needMaskImageFallback:function(){
       console.log('needMaskImageFallback');
      return (document.documentElement.style['-webkit-mask-image'] !== undefined) ? "" : "mask-image-fallback"
    }
 });

