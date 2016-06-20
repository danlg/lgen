import Cropper from 'cropperjs'

var img,inputParameters;

Template.UploadIcon.events({	
	'click #save': function(event, tmp){
        var imageCropped = img.getCroppedCanvas().toDataURL()
        var newData480 = imageResize(imageCropped, 480, 480)
        log.info("img480 created");
        var newData120 = imageResize(imageCropped, 120, 120);
        log.info("img120 created");
        Session.set(inputParameters.parentInputParameters.sessionToBeSet,newData120);
        Session.set(inputParameters.parentInputParameters.imageLarge,newData480);
        IonModal.close('YouIconChoose');      
    }
});

Template.UploadIcon.onRendered( function() {    
    inputParameters = Template.parentData(0);
    var imgHolder = this.find('#imageCrop');
    imgHolder.src = inputParameters.uploadedImage.result;
    img = CropPls(imgHolder);      
});

function CropPls(image) 
{
    var cropper = new Cropper(image, {
        aspectRatio: 1 / 1,
        viewMode: 1,
        dragMode: 'move',
        restore: false,
        autoCropArea: 0.65,
        modal: false,
        center:false,
        guides: false,
        highlight: false,
        cropBoxMovable: false,
        cropBoxResizable: false
    });

  return cropper;
}

function imageResize(img, width, height) {

    // create an off-screen canvas
    var canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');

    // set its dimension to target size
    canvas.width = width;
    canvas.height = height;
    var image = new Image();
    image.src = img;
    // draw source image into the off-screen canvas:
    ctx.drawImage(image, 0, 0, width, height);

    // encode image to data-uri with base64 version of compressed image
    return canvas.toDataURL();
}