Template.SchoolUserListItem.helpers({
  getUserEmail:function(){
      if(this.emails){
       return this.emails[0].address;
      }
  },
  getUserRoles:function(){
      var schoolUsername = Router.current().params.school;
      var schoolNamespace = Smartix.Accounts.School.getNamespaceFromSchoolName(schoolUsername);
      
      if(schoolNamespace){
          return this.roles[schoolNamespace].toString();
      }            

  }
});

Template.SchoolUserListItem.onCreated(function(){

    SchoolUserPages.set({
        filters:{
            schools: 'zt6ezNMXLM4bWqsRW'
        }
    });
    
});