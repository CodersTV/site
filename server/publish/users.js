Meteor.publish('Users', function () {
  return Meteor.users.find({}, { fields : { profile : 1, paypal: 1 } });
});

Meteor.publish('SelfUser', function () {
  return Meteor.users.find({_id: this.userId}, {fields: {profile: 1, paypal: 1, superchat: 1}});
});

Meteor.publish('SingleUser', function (userId) {
  return userId && Meteor.users.find({_id: userId}, {
    fields: {profile: 1, paypal: 1, superchat: 1}
  });
});
