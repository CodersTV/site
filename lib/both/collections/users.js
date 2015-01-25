
Meteor.users.setDescription = function (description) {
  var userId = Meteor.userId();

  return this.update({ _id: userId }, { $set: {
    'profile.description': description
  }});
};

Meteor.users.findOneFromCoderId = function (coderId) {
  // coderId can be its username or _id
  return this.findOne({$or: [
    {'profile.username': coderId},
    {_id: coderId}
  ]});
};

Meteor.users.findOneFromPath = function (path) {
  var coderId;

  if (_.isEmpty(path)) {
    return {};
  }

  coderId = path.split('/')[2];
  return this.findOneFromCoderId(coderPath);
};
