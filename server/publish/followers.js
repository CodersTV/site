Meteor.publish('Followers', function () {
  return Followers.find({followerId: this.userId});
});

Meteor.publish('CoderFollowers', function (coderId) {
  var user = Meteor.users.findOneFromCoderId(coderId);

  return Followers.find({coderId: user._id});
});

Meteor.publishRelations('SelfFollowersWithProfiles', function () {
  this.cursor(Followers.find({followerId: this.userId}), function (_id, follower) {
    this.cursor(Meteor.users.find({_id: follower.coderId}, {
      profile: 1
    }));
  });

  return this.ready();
});
