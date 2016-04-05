Meteor.publish( 
   'globalUsersBasicInfo', function(){
        if(Roles.userIsInRole(this.userId,'user','global')){
            console.log('try subscribe to globalUsersBasicInfo');
            
            return Roles.getUsersInRole('user','global',
                {
                    fields: { 
                        'profile.firstname':1,
                        'profile.lastname':1,
                        'emails.0.address':1
                    }
                }
            );                       
        }else{
            console.log('unanthorized subscription to globalUsersBasicInfo',this.userId);
        }
    }
);