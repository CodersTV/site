Meteor.publishRelations('FeaturedChannelWithUser', function () {
  this.cursor(Channels.find({featured: true}, {sort: {finishedAt: 1, createdAt: 1}}), function (_id, channel) {
    this.cursor(Meteor.users.find({_id: channel.owner}, {
      superchat: 1,
      profile: 1
    }));
  });

  return this.ready();
});

Meteor.publishRelations('ChannelsSearchWithUsers', function (searchText) {
  if (_.isEmpty(searchText)) {
    this.cursor(Channels.find({}, {sort: {finishedAt: 1, createdAt: 1}}), function (_id, channel) {
      this.cursor(Meteor.users.find({_id: channel.owner}, {
        profile: 1
      }));
    });
  } else {
    check(searchText, String);

    var regex = '.*' + searchText + '.*';
    this.cursor(Channels.find({$or : [
      {title: {$regex: regex, $options: 'i'}},
      {language: {$regex: regex, $options: 'i'}}
    ]}, {
      sort: {finishedAt: 1, createdAt: 1}
    }), function (_id, channel) {
      this.cursor(Meteor.users.find({_id: channel.owner}, {
        profile: 1
      }));
    });
  }
  return this.ready();
});

Meteor.publishRelations('ChannelsWithOwner', function (limit) {
  this.cursor(Channels.find({}, {sort: {finishedAt: 1, createdAt: 1}, limit: limit || 0}), function (_id, channel) {
    this.cursor(Meteor.users.find({_id: channel.owner}, {
      superchat: 1,
      profile: 1
    }));
  });

  return this.ready();
});

Meteor.publish('CoderChannel', function (coderId) {
  var channels = Channels.find({
    owner: coderId
  });

  if (channels.count() === 0) {
    // coderId could be username
    var user = Meteor.users.findOne({'profile.username': coderId});

    if (user) {
      channels = Channels.find({
        owner: user._id
      });
    }
  }

  return channels;
});

Meteor.publish('SelfVideos', function () {
  return Channels.find({owner: this.userId});
});
