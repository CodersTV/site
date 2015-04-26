Meteor.publish('Followers', function () {
  return this.userId && Followers.find({followerId: this.userId}) || this.ready();
});

Meteor.publish('CoderFollowers', function (coderId) {
  if (! coderId) {
    return this.ready();
  }

  var user = Meteor.users.findOneFromCoderId(coderId);

  return user && Followers.find({coderId: user._id}) || this.ready();
});

Meteor.publishRelations('SelfFollowersWithProfiles', function () {
  if (this.userId) {
    this.cursor(Followers.find({followerId: this.userId}), function (_id, follower) {
      this.cursor(Meteor.users.find({_id: follower.coderId}, {
        fields: {
          profile: 1
        }
      }));
    });
  }

  return this.ready();
});
