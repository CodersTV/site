Followers = new Meteor.Collection('followers');

/*
 * Add query methods like this:
 *  Followers.findPublic = function () {
 *    return Followers.find({is_public: true});
 *  }
 */

Follower = (function () {
  var set = function (coderId) {
    Followers.insert({coderId: coderId, followerId: Meteor.userId()});
  }; 
  var unset = function (coderId) {
    var followDoc = get(coderId);
    Followers.remove({_id: followDoc._id});
  };
  var get = function (coderId) {
    return Followers.findOne({coderId: coderId, followerId: Meteor.userId()});
  };

  return {
    set: set,
    unset: unset,
    get: get
  };
}());
