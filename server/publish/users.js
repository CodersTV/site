Meteor.publish('Users', function () {
  return Meteor.users.find({}, { fields : { profile : 1, paypal: 1 } });
});

Meteor.publish('SelfUser', function () {
  return this.userId && Meteor.users.find({_id: this.userId}, {
    fields: {profile: 1, paypal: 1, superchat: 1}
  }) || this.ready();
});

Meteor.publish('SingleUser', function (userId) {
  return userId && Meteor.users.find({$or: [
    {'profile.username': userId},
    {_id: userId}
  ]}, {
    fields: {profile: 1, paypal: 1, superchat: 1}
  }) || this.ready();
});
