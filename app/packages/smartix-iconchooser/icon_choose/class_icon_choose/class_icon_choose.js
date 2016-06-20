/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/* icon chooser
* input parameters:
* sessionToBeSet: icon user choose would be set to this session.
* iconListToGet:  the icon list html string to be retrieved would be stored to this session
*/
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

/* ClassIconChoose: Lifecycle Hooks */
Template.ClassIconChoose.onCreated( function() {
	var inputParameters = Template.parentData(0);
	$.getJSON('/packages/smartix_iconchooser/icon_list/class_avatar.json',function(result){
		Session.set(inputParameters.iconListToGet, result);
	});	
});

Template.ClassIconChoose.onRendered( function() {
});

Template.ClassIconChoose.destroyed = function () {
};

