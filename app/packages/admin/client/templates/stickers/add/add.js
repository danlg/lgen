Template.AdminStickersAdd.onCreated(function () {
    let self = this;
    self.stickerArr = new ReactiveVar([]);
    self.metadataObj = new ReactiveVar({});
    self.subscribe("stickers");
});

Template.AdminStickersAdd.helpers({
    stickerArray: function () { 
        return Template.instance().stickerArr.get();
    },

    libraryInfo: function(){
        return Template.instance().metadataObj.get();
    }
});

var clearForm = function ( ) {
    // Clear form values
    $('#sticker-category').val("");
    $('sticker-subcategory').val("");
    $('sticker-price').val("");
    Template.instance().imageArr.set([]);
};

Template.AdminStickersAdd.events({

    'click #sticker-clear':function(event,template){
        //log.info("clear");
        clearForm();
    },
    
    'click #sticker-metadata-submit': function (event, template) {
        var metadataObj = {};
        metadataObj.category = $('#sticker-category').val();
        metadataObj.subcategory = $('#sticker-subcategory').val();
        metadataObj.price = $('#sticker-price').val() || '0';
        metadataObj.tradable = $('#sticker-tradable').is(":checked");
        template.metadataObj.set(metadataObj);

        $('#sticker-category').attr('readonly', 'readonly');
        $('#sticker-subcategory').attr('readonly', 'readonly');
        $('#sticker-price').attr('readonly', 'readonly');
        $('#sticker-tradable').attr('readonly', 'readonly');
        // log.info(metadataObj);
        getOtherStickersInCategory(event, template);
        var uploadContainer = $('#uploadForm');
        uploadContainer.show();
        var buttonContainer = $('#sticker-buttons');
        buttonContainer.hide();
    },

    'change #imageBtn': function (event, template) {
        //https://github.com/CollectionFS/Meteor-CollectionFS
        //Image is inserted from here via FS.Utility
        var files = event.target.files;
        if (files.length > 0) {
            stickerName = $('#sticker-name').val();
            uploadSticker(files[0], template, stickerName, function (error, result) {
                if (error)
                    log.error(error);
            });
        }
    },

});

var uploadSticker = function(filePath, template, stickerName) {
    var newFile = new FS.File(filePath);
    let libraryMetadata = template.metadataObj.get();
    libraryMetadata.name = stickerName;
    newFile.metadata = libraryMetadata;
    Stickers.insert(newFile, function(err, fileObj) {
        if (err) 
        {
            log.error(err);
            throw Meteor.Error('upload-error', "There was an error during upload");
        }
        else
        {
            var stickerArr = template.stickerArr.get();
            stickerArr.push(stickerName);
            template.stickerArr.set(stickerArr);
            log.info("Successfully uploaded!");
        }
    });
};

var getOtherStickersInCategory = function(event, template)
{
    let recievedData = template.metadataObj.get();
    var stickersInCategory = Stickers.find({
        'metadata.category': recievedData.category,
        'metadata.subcategory': recievedData.subcategory
    }).fetch();
    if(stickersInCategory.length > 0)
    {
        lodash.forEach(stickersInCategory, function(stickerObj)
        {
            var stickerArray = template.stickerArr.get();
            let name = stickerObj.metadata.name || 'name empty';
            stickerArray.push(name);
            template.stickerArr.set(stickerArray);
        })
    }
}