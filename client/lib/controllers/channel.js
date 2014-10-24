function getCurrentCoder (coderId) {
  if (! coderId) {
    return {
      userId: coderId
    };
  }

  var user = Meteor.users.findOne({'profile.username': coderId}),
  currentCoder = {coderId: coderId};

  if (user) {
    return {
      userId: user._id,
      username: coderId,
      name: user.profile.name
    };
  }

  return {
    userId: coderId
  };
}


ChannelController = FastRender.RouteController.extend({
  waitOn: function () {
    var path = Path.get(true);

    return [
      Meteor.subscribe('userPresence', path),
      Meteor.subscribe('Channels', Session.get('channelSearchQuery')),
      Meteor.subscribe('Users'),
      Meteor.subscribe('Followers'),
    ];
  },
  onBeforeAction: function () {
    var coderId = this.params.coderId;
    var videoId = this.params.videoId;
    var currentCoder = getCurrentCoder(coderId);
    var currentVideo = Channel.get(currentCoder.userId, videoId);
    var title = TITLE;

    Session.set('channelSearchQuery', this.params.keyword);
    Session.set('currentCoder', currentCoder.userId);
    Session.set('currentUsername', currentCoder.username);
    Session.set('currentVideo', videoId);
    if (currentVideo) {
      title = currentVideo.title + ' by ' + currentCoder.name + ' coding with ' + currentVideo.language + title;
    } else if (currentCoder.name) {
      title = currentCoder.name + title;
    } else {
      title = 'Coders' + title;
    }

    document.title = title;
  }
});
