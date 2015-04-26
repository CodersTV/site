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

      var seoTitle = channel.title + ' by ' + coder.profile.name + ' | CodersTV';
      SEO.set({
        title: seoTitle,
        rel_author: coder.superchat.url || '',
        meta: {
          description: channel.description
        },
        og: {
          type: 'profile',
          'profile:first_name': coder.superchat.givenName,
          'profile:last_name': coder.superchat.familyName,
          'profile:username': coder.profile.username || coder.profile.name,
          title: seoTitle,
          description: channel.description,
          image: coder.superchat.pic_square
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

      var seoTitle = channel.title + ' by ' + coder.profile.name + ' | CodersTV';
      SEO.set({
        title: seoTitle,
        rel_author: coder.superchat.url || '',
        meta: {
          description: channel.description
        },
        og: {
          type: 'video.other',
          'video:writer': coder.profile.name,
          'video:release_date': (new Date(channel.finishedAt)).toISOString(),
          'video:tags': channel.language,
          title: seoTitle,
          description: channel.description,
          image: coder.superchat.pic_square
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
