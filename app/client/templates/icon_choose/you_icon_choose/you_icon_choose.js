/* icon chooser
* input parameters:
* sessionToBeSet: icon user choose would be set to this session.
* iconListToGet:  the icon list html string to be retrieved would be stored to this session
*/
Template.YouIconChoose.events({
	
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

Template.YouIconChoose.helpers({
	getYouIconList:function(){
		return Session.get(this.iconListToGet);
	}
});

Template.YouIconChoose.created = function () {
	var inputParameters = Template.parentData(0);
	//TODO this should be the only thing being in child Object class
	//the rest should be in base class IconChoose
	//base class for YouIconChoose and ClassIconChoose
	//do not want any side effect with Session so duplicate code for now....
	$.getJSON('/icon_list/profile_avatar.json',function(result){
		Session.set(inputParameters.iconListToGet, result);
	});	
};

Template.YouIconChoose.rendered = function () {


};

Template.YouIconChoose.destroyed = function () {
};

