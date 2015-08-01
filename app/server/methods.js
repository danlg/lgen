/*****************************************************************************/
/* Server Only Methods */
/*****************************************************************************/

var mailtemplate={
    "message": {
        "html": "<p>Example HTML content</p>",
        "text": "Example text content",
        "subject": "example subject",
        "from_email": "message.from_email@example.com",
        "from_name": "Example Name",
        "to": [
            {
                "email": "mike@sanuker.com",
                "name": "Recipient Name",
                "type": "to"
            }
        ],
      }
}

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
   'simplemail':function(){
     try{
       Mandrill.messages.send(mailtemplate)
     }catch(e){
       console.log(e);
     }
   }



});
