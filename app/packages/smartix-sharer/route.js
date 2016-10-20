Router.route('EmailInvite', {
  path: "/class/:classCode/invite-email"
});

Router.route('ShareInvite', {
  path: "/class/:classCode/invite/share"
});

Router.route('join/', {
  name: 'ClassSearchInformationForWebUser'
});

Router.route('join/:classCode?', {
  name: 'ClassInformationForWebUser'
});