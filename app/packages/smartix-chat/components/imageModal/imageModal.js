import blobUtil from 'blob-util';

isLoading = new ReactiveVar(false);

Template.imageModal.helpers({
    isLoading: function(){
        return isLoading.get();
    }
});

Template.imageModal.events({
	// Here handling chat image long press - on long press showing popup for save/cancel the image to mobile gallery - Rajit Deligence
	//'contextmenu #dt-image-chat': function (e) {
	// not used yet to debug
	//cordova-base64-to-gallery@4.1.1
	'click #imageGallery': function(event, template){
		var img = document.getElementById('imageHolder');
		//log.info("Test", img);
        isLoading.set(true);
		function getBase64ImageHolder(image) {
			var imgSrc = image.getAttribute('src');
			log.info("getBase64ImageHolder/imgSrc="+imgSrc);
			imgSrc = imgSrc.split('?')[0];
			//https://github.com/nolanlawson/blob-util#imgSrcToBlob API
			var saveImage = blobUtil.imgSrcToDataURL(imgSrc, 'image/png', { crossOrigin: 'Anonymous' }, 1.0).then(function (dataURL) {
				//log.info("Data URL", dataURL);
				var params = { data: dataURL, quality: 100 };
				window.imageSaver.saveBase64Image(params,
					function (result) {
						log.info('window.imageSaver.saveBase64Image.result OK' + result);
						toastr.info("Image saved successfully in photo album");
                        isLoading.set(false);
					},
					function (error) {
						log.error('window.imageSaver.saveBase64Image.error ' + error);
						toastr.error("Error saving image");
                        isLoading.set(false);
					}
				);			// log.info(schoolbannerSource, dataURL);
			}).catch(function (err) {
                isLoading.set(false);
				log.error("cannot save image", err);
			});           
                //.replace(/^data:image\/(png|jpg);base64,/, "");
		}
		var getBase64 = getBase64ImageHolder(img);
	}
});
