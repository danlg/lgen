

/*****************************************************************************/
/* MainLayout: Event Handlers */
/*****************************************************************************/
Template.MainLayout.events({
});

/*****************************************************************************/
/* MainLayout: Helpers */
/*****************************************************************************/
Template.MainLayout.helpers({
});

/*****************************************************************************/
/* MainLayout: Lifecycle Hooks */
/*****************************************************************************/
Template.MainLayout.created = function () {
};

Template.MainLayout.rendered = function () {
  loginVM.bind(this);
};

Template.MainLayout.destroyed = function () {
};
