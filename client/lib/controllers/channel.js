CoderController = RouteController.extend({
  template: 'channel',
  waitOn: function () {
    return [
      Meteor.subscribe('CoderChannel', this.params.coderId),
      Meteor.subscribe('SingleUser', this.params.coderId),
      Meteor.subscribe('CoderFollowers', this.params.coderId)
    ];
  },
  onAfterAction: function () {
    var coder = Meteor.users.findOneFromCoderId(this.params.coderId);
    if (! _.isEmpty(coder)) {
      Session.set('coder', coder);
      Session.set('chatHost', coder._id);
      Session.set('currentCoder', coder._id);
      Meteor.subscribe(
        'userPresenceWithProfile',
        coder.profile.username,
        coder._id,
        function () {
          Session.set('chatSubsReady', true);
        }
      );
    }
  }
});

VideoController = RouteController.extend({
  template: 'channel',
  waitOn: function () {
    return [
      Meteor.subscribe('CoderChannel', this.params.coderId),
      Meteor.subscribe('SingleUser', this.params.coderId),
      Meteor.subscribe('CoderFollowers', this.params.coderId)
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
