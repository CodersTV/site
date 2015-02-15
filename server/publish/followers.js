Meteor.publish('Followers', function () {
  return Followers.find({followerId: this.userId});
});

Meteor.publish('CoderFollowers', function (coderId) {
  var user = Meteor.users.findOneFromCoderId(coderId);

  return Followers.find({coderId: user._id});
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
