TabularTables = {};


Template.Perf.events({
	
	'click .getUserList':function(e){
		log.info('its clicked');
		var userList = Meteor.call('getUserList',function(err,data){
		
		   if(err)
   					 console.log(err);
					
			console.log(data);
			
			Session.set('userListArray',data);
  		
		});



	},
	'click .getClassList':function(){
		log.info('its clicked');
		var userList = Meteor.call('getClassList',function(err,data){
			 
			 if(err)
   					 console.log(err);
					
			console.log(data);
			
			Session.set('classListArray',data);
		});

	},	
	'click .getSetting':function(){
		log.info('its clicked');
		var userList = Meteor.call('getSetting',function(err,data){
			 
			 if(err)
   					 console.log(err);
					
			console.log(data);
			
			Session.set('settingArray',data);
		});

	},		
});

Template.Perf.helpers({
	userListArray:function(){
		if(Session.get('userListArray')){
			return Session.get('userListArray');
		}else{
			return "";
		}
		
	},
	classListArray:function(){
		if(Session.get('classListArray')){
			return Session.get('classListArray');
		}else{
			return "";
		}
		
	},	
	settingArray:function(){
			if(Session.get('settingArray')){
				return Session.get('settingArray');
			}else{
				return "";
			}
		
	},
    userListSettings: function () {
        return {
            rowsPerPage: 10,
            showFilter: false,
            fields: ['createdAt','emails.0.address','emails.0.verified']
        };
    },		
    settingsSettings: function () {
        return {
            rowsPerPage: 10,
            showFilter: false,
            fields: ['ROOT_URL','SHARE_URL']
        };
    }	
});