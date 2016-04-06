Meteor.publish( 
   'globalUsersBasicInfo', function(){
        if(Roles.userIsInRole(this.userId,'user','global')){
            //console.log('try subscribe to globalUsersBasicInfo');
            var currentUserId = this.userId;
            var usersInRole = Roles.getUsersInRole('user','global').fetch();
           
            var usersIDInRole = lodash.map(usersInRole,'_id');
            //console.log(usersIDInRole);
            
            //filter out current user since mergebox only work on top-level
            var filteredUsersIDInRole = usersIDInRole.filter(function(value){
               //console.log(value);
               //console.log(this.userId);
               if(value == currentUserId){  
                   return false;
               }else{
                   return true;
               }
            });
            //console.log(filteredUsersIDInRole);
            
            //TODO: soft-delete filtered => deleteAt
            return Meteor.users.find({_id: {"$in" : filteredUsersIDInRole }},
                {
                    fields: { 
                        'profile.firstname':1,
                        'profile.lastname':1,
                        'emails.0.address':1
                    }
                }
            );                       
        }else{
            //console.log('unanthorized subscription to globalUsersBasicInfo',this.userId);
        }
    }
);