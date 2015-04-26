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
    var channel = Channels.findOne();

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

      SEO.set({
        title: channel.title + ' by ' + coder.profile.name + ' | CodersTV',
        rel_author: coder.superchat.url || '',
        meta: {
          description: channel.description
        },
        og: {
          type: 'profile',
          'profile:first_name': coder.superchat.givenName,
          'profile:last_name': coder.superchat.familyName,
          'profile:username': coder.profile.username || coder.profile.name,
          title: channel.title,
          description: channel.description,
          image: coder.image
        }
      });
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
    var channel = Channels.findOne();

    if (! _.isEmpty(coder)) {
      Session.set('coder', coder);
      Session.set('currentCoder', coder._id);

      SEO.set({
        title: channel.title + ' by ' + coder.profile.name + ' | CodersTV',
        rel_author: coder.superchat.url || '',
        meta: {
          description: channel.description
        },
        og: {
          type: 'video.other',
          'video:writer': coder.profile.name,
          'video:release_date': (new Date(channel.finishedAt)).toISOString(),
          'video:tags': channel.language,
          title: channel.title,
          description: channel.description,
          image: coder.image
        }
      });
    }
  }
});

CoderListController = RouteController.extend({
  template: 'channels',
  waitOn: function () {
    return Meteor.subscribe('ChannelsWithOwner');
  }
});
