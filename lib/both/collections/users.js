
Meteor.users.setDescription = function (description) {
  var userId = Meteor.userId();

  return this.update({ _id: userId }, { $set: {
    'profile.description': description
  }});
};

