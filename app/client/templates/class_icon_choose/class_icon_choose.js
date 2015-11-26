Template.ClassIconChoose.events({
	
	'click .emojicon': function(event){
		
		var clickedIconValue = $(event.target).attr('title');
		log.info(clickedIconValue);
		
		if(clickedIconValue){
			Session.set('chosenIcon',clickedIconValue);
			log.info("session of chosenIcon: " + Session.get('chosenIcon'));
		}
		
	}
});