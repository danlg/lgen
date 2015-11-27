Template.ClassIconChoose.events({
	
	'click .emojicon': function(event){
		
		var clickedIconValue = $(event.target).attr('title');
		
		if(clickedIconValue){
			var inputParameters = Template.parentData(0);
			Session.set(inputParameters.sessionToBeSet,clickedIconValue);
			log.info("session of "+ inputParameters.sessionToBeSet+ ": " + 
					 Session.get(inputParameters.sessionToBeSet));
		}
		
	}
});

Template.ClassIconChoose.helpers({
	getClassIconList:function(){
		return Session.get(this.iconListToGet);
	}
});

/*****************************************************************************/
/* ClassIconChoose: Lifecycle Hooks */
/*****************************************************************************/
Template.ClassIconChoose.created = function () {
	var inputParameters = Template.parentData(0);
	$.getJSON('/icon_list/class.json',function(result){
		Session.set(inputParameters.iconListToGet, result);
	});	
};

Template.ClassIconChoose.rendered = function () {


};

Template.ClassIconChoose.destroyed = function () {
};

