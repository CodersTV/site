var services = ServiceConfiguration.configurations._collection.findOne({service: 'google'});
var googleServiceConfig = _.extend(Meteor.settings.google, {
  service: 'google'
});

if (! services) {
  ServiceConfiguration.configurations._collection.insert(googleServiceConfig);
}

process.env.MAIL_URL = Meteor.settings.mailgun.MAIL_URL;
Channels._ensureIndex({ owner : 1 });

UsersRoles = (function () {
  types = {
    admin: [
      'gabrielhpugliese@gmail.com',
      'kaumac@gmail.com',
      'gabrarlz@gmail.com'
    ],
    beta: []
  };

  _init = (function () {
    _.each(types, function (value, key) {
      if (_.isEmpty(Roles.getUsersInRole(key))) {
        Roles.deleteRole(key);
        Roles.createRole(key);
      }
    })
  }());

  return {
    types: types
  };
}());

