

Template.search.liveList = function () {
  return Channels.find({isLive : true}, {sort: {watchers: 1}});
};

Template.search.pastList = function () {
  return Channels.find({isLive: false}, {sort: {finishedAt: -1}});
};

Template.search.destroyed = function () {
  Session.set('channelSearchQuery', '');
};

Template.search_input_channels.events({
  'submit #header-search': function (event, t) {
    event.preventDefault();
    var searchQuery = t.find('input').value;

    trackEvent('search', {'keyword': searchQuery});
    Router.go(Router.routes.search.path({keyword: searchQuery}));
    $('#search-box').toggleClass('hidden');
    $('#search-icon').toggleClass('fa-search fa-times margin-2');
  }
});

Template.search_input_channels_xs.events({
  'submit #header-search-xs': function (event, t) {
    event.preventDefault();
    var searchQuery = t.find('input').value;

    trackEvent('search', {'keyword': searchQuery});
    Router.go(Router.routes.search.path({keyword: searchQuery}));
    if (findBootstrapEnvironment() === 'xs') {
      $(t.find(".navbar-collapse")).collapse('toggle');
    }
  }
});
