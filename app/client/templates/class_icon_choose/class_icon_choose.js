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

Template.ClassIconChoose.helpers({
	getClassIconList:function(){	
		return Session.get('iconListForClass');
	}
});

/*****************************************************************************/
/* ClassIconChoose: Lifecycle Hooks */
/*****************************************************************************/
Template.ClassIconChoose.created = function () {
	$.getJSON('/icon_list/class.json',function(result){
		Session.set('iconListForClass', result);
	});	
};

Template.ClassIconChoose.rendered = function () {


};

Template.ClassIconChoose.destroyed = function () {
};

