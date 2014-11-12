Template.layout.styleLoginButtons = function () {
  var $loginButtons = this.$('#login-buttons');
  $loginButtons.addClass('btn btn-info');
  $loginButtons.attr('style', function (i, s) {
    var style = ' line-height: 20px !important;';
    if (! s) return style;
    return s + style;
  });
};

Template.layout.rendered = function () {
  YTMenu();
  Template.layout.styleLoginButtons.call(this);
};

Template.layout.channelsCount = function () {
  return Channel.getLiveCount();
}

Template.layout.languagesCount = function () {
  // return _.uniq(_.pluck(Channels.find({ isLive : true }).fetch(), 'language')).length;
  return Languages.find().count();
}

Template.layout.featuredLanguages = function () {
  var channels = Channels.find().fetch(),
  uniqLanguages = _.uniq(_.pluck(channels, 'language'));

  if ( !uniqLanguages.length )
    return [];

  return Languages.find({ name : { $in : uniqLanguages } }, { sort : { watchers : -1 } , limit : 5 });
};

Template.layout.featuredChannels = function () {
  return Channels.find({ isLive : true }, { sort : { watchers : -1, limit : 5 } });
};

Template.header.events({
  'click .dropdown-toggle': function () {
    if ($("#login-dropdown-list").attr("class") === "dropdown open") {
      $('.dropdown open').removeClass('open');
    } else {
      $('.dropdown').addClass('open');
    }
  },
  'click #sign-out': function (event) {
    event.preventDefault();
    Meteor.logout();
  },
  'click #search-btn': function (event, t) {
    event.preventDefault();
    $(t.find("#search-icon")).toggleClass('fa-search fa-times margin-2');
    $(t.find("#search-box")).toggleClass('hidden show animated flipInX');
  },
  'click li a': function (event, t) {
    if (findBootstrapEnvironment() === 'xs') {
      $(t.find(".navbar-collapse")).collapse('toggle');
    }
  },
  'click .navbar-toggle': function (event, t) {
    if (findBootstrapEnvironment() === 'xs') {
      $(t.find(".navbar-collapse")).collapse('toggle');
    }   
  }
});
