Router.route('TourFromHomePage',{
    layoutTemplate:'',//otherwise we get a green header on the page,
    template:"Tour",
    path:"/"
  }
);

Router.route('Tour',{
    layoutTemplate:'',//otherwise we get a green header on the page,
    template:"Tour",
    path:"/tour"
  }
);

Router.route('HowToInvite',{
    layoutTemplate:'',
    path:"help/howtoinvite"
  }
);

Router.route('HowToInviteShort/:classCode',{
    name: 'HowToInviteShort',
    layoutTemplate:'',
    path:"help/joininapp/:classCode"
  }
);