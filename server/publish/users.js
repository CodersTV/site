Meteor.publish('Users', function () {
  return Meteor.users.find({}, { fields : { profile : 1, paypal: 1, mentor: 1 } });
});
