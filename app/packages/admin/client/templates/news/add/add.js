Template.AdminNewsAdd.events({
    'click #addNews-submit': function (event, template) {

        var title = $('#addNews-title').val();
        var content = $('#addNews-content').val();
        event.preventDefault();

        $("input[type='checkbox'][name='addNews-newsgroup']").each(function (index) {
            if (this.checked) {
                console.log(this.value); //where value equal newsgroup url

                Meteor.call('smartix:messages/createNewsMessage', this.value, 'article', { content: content, title: title });
            }
        });
    }
});