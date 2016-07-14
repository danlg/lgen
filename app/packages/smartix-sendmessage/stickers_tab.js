Template.StickersTab.onCreated(function()
{
    this.subscribe('stickers');
});

Template.StickersTab.helpers({
    stickerCategory: function(){
        var stickerArray = Stickers.find().fetch();
        let categoryArray = [];
        categoryArray = lodash.uniqBy(stickerArray, 'metadata.subcategory');
        categoryArray = lodash.map(categoryArray, 'metadata.subcategory');
        return categoryArray;
    },

    stickers: function (subcategoryName) {
        return Stickers.find({'metadata.subcategory': subcategoryName}).fetch();
    }
})
