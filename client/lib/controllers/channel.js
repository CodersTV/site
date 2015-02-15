CoderController = RouteController.extend({
  template: 'channel',
  waitOn: function () {
    return [
      Meteor.subscribe('ChannelWithOwnerAndFollowers', this.params.coderId),
      Meteor.subscribe('SingleUser', this.params.coderId)
    ];
  },
  onAfterAction: function () {
    var coder = Meteor.users.findOneFromCoderId(this.params.coderId);
    if (! _.isEmpty(coder)) {
      Session.set('coder', coder);
      Meteor.subscribe(
        'userPresenceWithProfile',
        coder.profile.username,
        coder._id,
        function () {
          Session.set('chatSubsReady', true);
        }
      );
      Session.set('currentCoder', coder._id);
    }
  }
});

VideoController = RouteController.extend({
  template: 'channel',
  waitOn: function () {
    return [
      Meteor.subscribe('ChannelWithOwnerAndFollowers', this.params.coderId),
      Meteor.subscribe('SingleUser', this.params.coderId)
    ];
  },
  onAfterAction: function () {
    var coder = Meteor.users.findOneFromCoderId(this.params.coderId);
    if (! _.isEmpty(coder)) {
      Session.set('coder', coder);
      Session.set('currentCoder', coder._id);
    }
  }
});

CoderListController = RouteController.extend({
  template: 'channels',
  waitOn: function () {
    return Meteor.subscribe('ChannelsWithOwner');
  }
});
