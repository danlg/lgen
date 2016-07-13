Template.AdminStickersView.onCreated(function () {
    let self = this;
    self.subscribe("stickers");
    self.stickersChecked = new ReactiveVar([]);
    self.processedStickerFilter = new ReactiveDict();
    self.processedStickerFilter.set('category', '');
    self.processedStickerFilter.set('subcategory', '');
    self.processedStickerFilter.set('stickerName', '');
});

Template.AdminStickersView.helpers({
    stickerData: function () {

        let category= Template.instance().processedStickerFilter.get('category');
        let subcategory= Template.instance().processedStickerFilter.get('subcategory');
        let stickerName= Template.instance().processedStickerFilter.get('stickerName');
        
        var stickers =  Stickers.find({
                $and: [{
                    'metadata.category': { $regex: category }
                }, {
                    'metadata.subcategory': { $regex: subcategory }
                }, {
                    'metadata.name': { $regex: stickerName }
                }]
            }).fetch();
        return stickers;
    },

    isTradable: function(tradeableValue)
    {   
        return tradeableValue ? 'Yes' : 'No';
    },

    stickersChecked: function(stickerId)
    {
        return (  Template.instance().stickersChecked.get().indexOf(stickerId) !== -1 ) ? "checked" : "";
    },

    showOptions: function () {
        return Template.instance().stickersChecked.get().length > 0;
    }
});

Template.AdminStickersView.events({
    'click .sticker-directory-checkbox': function(event, template)
    {
        if ($(event.target).prop('checked')) {
            let latestArray = template.stickersChecked.get();
            latestArray.push($(event.target).val());
            template.stickersChecked.set(latestArray);
        } else {
            let latestArray = template.stickersChecked.get();
            //log.info($(event.target).val());
            lodash.pull(latestArray, $(event.target).val());
            template.stickersChecked.set(latestArray);
        }
        log.info("Stickers Checked", template.stickersChecked.get());
    },

    'click #stickersUpdateFilter': function(event, template)
    {
        Template.instance().processedStickerFilter.set('category', template.$('#sticker_category').val());
        Template.instance().processedStickerFilter.set('subcategory', template.$('#sticker_subcategory').val());
        Template.instance().processedStickerFilter.set('stickerName', template.$('#sticker_name').val());
    },
    'click #delete-stickers': function(event, template){
        let latestArray = template.stickersChecked.get();
        lodash.forEach(latestArray, function(stickerId)
        {
            Stickers.remove(stickerId);
        })
    }
});