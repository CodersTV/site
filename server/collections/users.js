/*
 * Add query methods like this:
 *  Users.findPublic = function () {
 *    return Users.find({is_public: true});
 *  }
 */
var debug = Meteor.npmRequire('debug')('ct:server:users.js');
var Fiber = Npm.require('fibers');
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

Accounts.onLogin(function (info) {
  if (! info.user.services.google.refreshToken) return;

  Meteor.setTimeout(function () {
    debug('Saving user profile. User _id: ' + info.user._id);
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
  }, 0);
});
