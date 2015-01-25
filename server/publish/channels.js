Meteor.publishComposite('FeaturedChannelWithUser', function () {
  return {
    find: function () {
      return Channels.find({}, {sort: {finishedAt: 1, createdAt: 1}});
    },
    children: [{
      find: function (channel) {
        return Meteor.users.find({_id: channel.owner}, {
          superchat: 1,
          profile: 1
        });
      }
    }]
  };
});

Meteor.publishComposite('ChannelsSearchWithUsers', function (searchText) {
  return {
    find: function () {
      if (_.isEmpty(searchText)) {
        return Channels.find({}, {sort: {finishedAt: 1, createdAt: 1}});
      }
      check(searchText, String);

      var regex = '.*' + searchText + '.*';

      return Channels.find({$or : [
        {title: {$regex: regex, $options: 'i'}},
        {language: {$regex: regex, $options: 'i'}}
      ]}, {
        sort: {finishedAt: 1, createdAt: 1}
      });
    },
    children: [{
      find: function (channel) {
        return Meteor.users.find({_id: channel.owner}, {
          profile: 1
        });
      }
    }]
  };
});

Meteor.publishComposite('ChannelsWithOwner', function (limit) {
  return {
    find: function () {
      return Channels.find({}, {sort: {finishedAt: 1, createdAt: 1}, limit: limit || 0});
    },
    children: [{
      find: function (channel) {
        return Meteor.users.find({_id: channel.owner}, {
          superchat: 1,
          profile: 1
        });
      }
    }]
  };
});

Meteor.publishComposite('ChannelWithOwnerAndFollowers', function (coderId) {
  return {
    find: function () {
      var channels = Channels.find({
        owner: coderId,
        isLive: true
      });

      if (channels.count() === 0) {
        // coderId is username
        var user = Meteor.users.findOne({'profile.username': coderId});
        channels = Channels.find({
          owner: user._id,
          isLive: true
        });
      }

      return channels;
    },
    children: [{
      find: function (channel) {
        return Meteor.users.find({_id: channel.owner}, {
          superchat: 1,
          profile: 1
        });
      }
    }, {
      find: function (channel) {
        return Followers.find({followerId: this.userId});
      }
    }]
  };
});

Meteor.publishComposite('VideoWithOwnerAndFollowers', function (videoId) {
  return {
    find: function () {
      return Channels.find({_id: videoId});
    },
    children: [{
      find: function (channel) {
        return Meteor.users.find({_id: channel.owner}, {
          superchat: 1,
          profile: 1
        });
      }
    }, {
      find: function (channel) {
        return Followers.find({followerId: this.userId});
      }
    }]
  };
});

Meteor.publish('SelfVideos', function () {
  return Channels.find({owner: this.userId});
});
