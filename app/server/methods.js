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
   },
   "class/invite":function(doc){

     console.log(doc);

    var classObj = Classes.findOne({classCode:doc.classCode});
     var first = Meteor.user().profile.firstname;
     var last = Meteor.user().profile.lastname;


     Meteor.setTimeout(function() {
       try{
         Mandrill.messages.send(inviteClassMailTemplate(
           doc.emailOrName,
           first,
           last,
           doc.classCode,
           classObj.className
           ));
       }catch(e){
         console.log(e);
       }
     }, 2 * 1000);

     /*Router.go("Classes");*/

   }



});
