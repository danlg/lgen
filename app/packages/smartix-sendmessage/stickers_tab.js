Template.StickersTab.onCreated(function()
{
    this.subscribe('stickers');
    this.isFreeSticker = new ReactiveVar(true);
    inputParameters = Template.parentData(0);
});

Template.StickersTab.helpers({
    stickerCategory: function(){
        var stickerArray = Stickers.find().fetch();
        let categoryArray = [];
        categoryArray = lodash.uniqBy(stickerArray, 'metadata.subcategory');
        categoryArray = lodash.map(categoryArray, 'metadata.subcategory');
        return categoryArray;
    },

    stickersFree: function () {
        return Stickers.find({'metadata.price': '0'}).fetch();
    },


    stickersPremium: function () {
        return Stickers.find({'metadata.price': {$ne: '0'}}).fetch();
    },

    isFreeTabActive: function()
    {
        return Template.instance().isFreeSticker.get() ? 'activeTab' : '';
    },

    isPremiumTabActive: function(){
        return Template.instance().isFreeSticker.get() ? '' : 'activeTab';
    },

    isFreeTab: function(){
        return Template.instance().isFreeSticker.get();
    }
})


Template.StickersTab.events({
    'click #freeBtn': function(events, template)
    {
        template.isFreeSticker.set(true);
    },

    'click #premiumBtn': function(events, template)
    {
        template.isFreeSticker.set(false);
    },

    'click .sticker': function(event)
    {
        var clickedStickerId = $(event.target).attr('title');
        if (clickedStickerId) {
        Session.set(inputParameters.stickerChosen, clickedStickerId);
        log.info("session of " + inputParameters.stickerChosen + ": " +
            Session.get(inputParameters.stickerChosen));
        }
    }
})

Template.registerHelper('stickerChooserHelper',function(iconArray){
   var COLUMN = 4;
   //log.info(iconArray);
   var output=[];
   if(iconArray){    
       var iconArrayLength = iconArray.length;   
       iconArray.forEach(function(currentValue,index){
         //start a row for every COLUMN items
         if((index+1) % COLUMN == 1){
             output.push( "<div class='row'>" );
         }  
         let imageSrc = currentValue.url({store: 'stickers', uploading:'images/uploading.gif', storing:'/images/storing.gif'})
         output.push( "<div class='col'><a data-dismiss='modal'><img title='"+currentValue._id+"' src='"+imageSrc+"' class='icon sticker e1a-5x'></i></a></div>" );
         //close a row for every COLUMN items
         if((index+1) % COLUMN == 0){     
             output.push( "</div>" );
         }
         //at the end of the for each loop, fill in empty columns so the last row looks nice
         if((index+1) == iconArrayLength){
             var remainCols = COLUMN - ((index+1) % COLUMN);     
             while(remainCols > 0){
                 output.push("<div class='col'></div>");
                 if(remainCols == 1){
                     //close a row for the last item
                     output.push("</div>");
                 }
                 remainCols--;
             }          
         }  
       });    
   }
   return output.join("");  
});