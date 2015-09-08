Template.bkvideo.rendered = function(){

	//// Use Modernizr to detect for touch devices,
	//// which don't support autoplay and may have less bandwidth,
	//// so just give them the poster images instead
	//console.log("here");
	//var screenIndex = 1,
	//	numScreens = $('.screen').length,
	//	isTransitioning = false,
	//	transitionDur = 1000,
	//	BV,
	//	videoPlayer,
	//	isTouch = Modernizr.touch,
	//	$bigImage = $('.big-image'),
	//	$window = $(window);
	//
	//if (!isTouch) {
	//	// initialize BigVideo
	//	BV = new $.BigVideo({forceAutoplay:isTouch});
	//	BV.init();
	//	showVideo();
	//
	//	BV.getPlayer().addEvent('loadeddata', function() {
	//		onVideoLoaded();
	//	});
    //
	//	// adjust image positioning so it lines up with video
	//	$bigImage
	//		.css('position','relative')
	//		.imagesLoaded(adjustImagePositioning);
	//	// and on window resize
	//	$window.on('resize', adjustImagePositioning);
	//}
    //
	//function showVideo() {
	//	BV.show($('#screen-'+screenIndex).attr('data-video'),{ambient:true});
	//}
    //
	//function onVideoLoaded() {
	//	$('#screen-'+screenIndex).find('.big-image').transit({'opacity':0},500)
	//}
    //
	//function adjustImagePositioning() {
	//	$bigImage.each(function(){
	//		var $img = $(this),
	//			img = new Image();
    //
	//		img.src = $img.attr('src');
    //
	//		var windowWidth = $window.width(),
	//			windowHeight = $window.height(),
	//			r_w = windowHeight / windowWidth,
	//			i_w = img.width,
	//			i_h = img.height,
	//			r_i = i_h / i_w,
	//			new_w, new_h, new_left, new_top;
    //
	//		if( r_w > r_i ) {
	//			new_h   = windowHeight;
	//			new_w   = windowHeight / r_i;
	//		}
	//		else {
	//			new_h   = windowWidth * r_i;
	//			new_w   = windowWidth;
	//		}
    //
	//		$img.css({
	//			width   : new_w,
	//			height  : new_h,
	//			left    : ( windowWidth - new_w ) / 2,
	//			top     : ( windowHeight - new_h ) / 2
	//		})
    //
	//	});
    //
	//}

};