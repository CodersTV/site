CoderController = RouteController.extend({
  template: 'channel',
  waitOn: function () {
    return Meteor.subscribe('ChannelWithOwnerAndFollowers', this.params.coderId);
  },
  onAfterAction: function () {
    var coder = Meteor.users.findOneFromCoderId(this.params.coderId);

    Meteor.subscribe('userPresence',
                     coder.profile.username,
                     coder._id)
  }
});

VideoController = RouteController.extend({
  template: 'channel',
  waitOn: function () {
    return Meteor.subscribe('VideoWithOwnerAndFollowers', this.params.videoId);
  },
  data: function () {
    return Channels.findOne({_id: this.params.videoId});
  }
});

CoderListController = RouteController.extend({
  template: 'channels',
  waitOn: function () {
    return Meteor.subscribe('ChannelsWithOwner');
  }
});
