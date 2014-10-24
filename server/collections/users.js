/*
 * Add query methods like this:
 *  Users.findPublic = function () {
 *    return Users.find({is_public: true});
 *  }
 */
var debug = Meteor.require('debug')('ct:server:users.js');
BetaUsers = new Meteor.Collection('betaUsers');

Meteor.users.allow({
  update: function (userId, doc, fields, modifier) {
    if (! _.contains(fields, 'profile')) {
      return false;
    }

    _.each(modifier.$set.profile, function (value, key) {
      check(value, String);
    });

    return doc._id === userId;
  }
});

//Meteor.users.incVisualizations = function (userId) {
//  var incremented = incrementCounter('user_' + userId + '_visualizations');
//
//  return this.update({ _id: userId }, { $set: 
//    { 'profile.visualizations': incremented }
//  });
//};
//
//Meteor.users.decVisualizations = function (userId) {
//  var incremented = incrementCounter('user_' + userId + '_visualizations');
//
//  return this.update({ _id: userId }, { $set: 
//    { 'profile.visualizations': incremented }
//  });
//};


Meteor.users.saveSuperchatInfo = function (user, profile) {
  // backwards compatibility in chat
  // TODO: remove this and use only gplusProfile
  if (! profile) return;

  var superchat = user.superchat || {};
  superchat = _.extend(superchat, {
    pic_square: profile.image.url.replace(/\?sz=50/, ''),
    url: profile.url,
    name: profile.name
  });

  return superchat;
}

Meteor.users.after.insert(function (userId, doc) {
  if (! doc.services.google.refreshToken) return;

  var profile = GPlus.getProfile(doc);

  // backwards compatibility in chat
  // TODO: remove this and use only gplusProfile
  if (_.isEmpty(profile)) {
    debug('Empty gplus profile. Exiting.');
    return;
  }
  doc.superchat = Meteor.users.saveSuperchatInfo(profile);
  doc.gplus = profile; 
  debug('Finished saving profile.');
});

Meteor.users.after.insert(function (userId, doc) {
  var email = doc.services.google.email;
  var _id = doc._id;
  var isBetaUser = (!! BetaUsers.findOne({email: email}));

  _.find(UsersRoles.types, function (value, key) {
    if (_.contains(value, email)) {
      Roles.addUsersToRoles(_id, key);
      return true;
    }
    return false;
  });

  if (isBetaUser) {
    Roles.addUsersToRoles(_id, 'beta');
  }
});

Meteor.users.after.insert(function (userId, doc) {
  doc.funds = {
    bitcoin: 0
  };
});

Accounts.onLogin(function (info) {
  if (! info.user.services.google.refreshToken) return;

  var profile = GPlus.getProfile(info.user);
  var superchat = Meteor.users.saveSuperchatInfo(info.user, profile);

  try {
    Meteor.users.update({ _id: info.user._id }, { $set: {
      gplus: profile,
      superchat: superchat
    }});
  } catch (err) {
    debug('Could not save user profile on login. Reason:', err);
  }
});
