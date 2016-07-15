Template.registerHelper('iconChooseHelper',function(iconArray){
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
         output.push( "<div class='col'><a data-dismiss='modal'><i title='"+currentValue+"' class='icon e1a-"+currentValue+" e1a-5x emojicon'></i></a></div>" );
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