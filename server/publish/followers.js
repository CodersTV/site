Meteor.publish('Followers', function () {
  return Followers.find({followerId: this.userId});
});

Meteor.publish('CoderFollowers', function (coderId) {
  return Followers.find({coderId: coderId});
});

Meteor.publishComposite('SelfFollowersWithProfiles', function () {
  return {
    find: function () {
      return Followers.find({followerId: this.userId});
    },
    children: [{
      find: function (follower) {
        return Meteor.users.find({_id: follower.coderId}, {
          profile: 1
        });
      }
    }]
  };
});
