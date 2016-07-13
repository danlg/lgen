Template.AdminStickersAdd.onCreated(function () {
    let self = this;
    this.subscribe("stickers");
    this.stickerArr = new ReactiveVar([]);
    this.metadataObj = new ReactiveVar({});
});

Template.AdminStickersAdd.helpers({
    stickerArray: function (argument) { 
        var stickersInCategory = Stickers.find({
            'metadata.category': Template.instance().metadataObj.category,
            'metadata.subcategory': Template.instance().metadataObj.subcategory
        }, {filename:1}).fetch();
        if(stickersInCategory.length > 0)
        {
            var stickerArray = Template.instance().stickerArr.get();
            log.info("stickerarr", stickersInCategory);
            stickerArray.push(stickersInCategory);
            Template.instance().stickerArr.set(stickerArray);
        }
        return Template.instance().stickerArr.get();
    },
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
        metadataObj.price = $('#sticker-price').val();
        metadataObj.tradable = $('#sticker-tradable').is(":checked");
        log.info("Obj", metadataObj);
        template.metadataObj.set(metadataObj);

        $('#sticker-category').attr('readonly', 'readonly');
        $('#sticker-subcategory').attr('readonly', 'readonly');
        $('#sticker-price').attr('readonly', 'readonly');
        $('#sticker-tradable').attr('readonly', 'readonly');

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
                    uploadSticker(files[0], template, function(error, result)
                    {
                        if(!error)
                        {
                            var stickerArr = template.stickerArr.get();
                            stickerArr.push(event.target.files[0].name);
                            template.stickerArr.set(stickerArr);
                        }
                    });
            }
    },

});

var uploadSticker = function(filePath, template) {
    var newFile = new FS.File(filePath);
    newFile.metadata = template.metadataObj.get();
    Stickers.insert(newFile, function(err, fileObj) {
        if (err) 
        {
            log.error(err);
            throw Meteor.Error('upload-error', "There was an error during upload");
        }
        else
        {
            log.info("Successfully uploaded!")
        }
    });
};