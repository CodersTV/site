Meteor.publish('Users', function () {
  return Meteor.users.find({}, { fields : { profile : 1, paypal: 1, mentor: 1 } });
});

Meteor.publish('UserFunds', function () {
  if (! this.userId) { return []; }
  return Meteor.users.find({ _id: this.userId }, { fields: { funds: 1 } });
})
