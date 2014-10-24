Meteor.publish('Followers', function () {
  return Followers.find({followerId: this.userId});
});
