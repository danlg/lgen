/*****************************************************************************/
/* Server Only Methods */
/*****************************************************************************/



Meteor.methods({
  /*
   * Example:
   *
   * '/app/items/insert': function (item) {
   * }
   */
   'ping':function(){
     console.log("asd");
     this.unblock();
     try{
       console.log(Mandrill.users.ping());
     }catch(e){
       console.log(e);
     }
   },
   'ping2':function(){
     console.log("asd");
     this.unblock();
     try{
       console.log(Mandrill.users.ping2());
     }catch(e){
       console.log(e);
     }
   },
   'addClassMail':function(to,classname){

  
     try{
       Mandrill.messages.send(addClassMailTemplate(to,classname));

     }catch(e){
       console.log(e);

     }


   }



});
