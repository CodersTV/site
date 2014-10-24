/*
 * Add query methods like this:
 *  Followers.findPublic = function () {
 *    return Followers.find({is_public: true});
 *  }
 */

Followers.allow({
  insert: function (userId, doc) {
    check(doc.coderId, String);
    check(doc.followerId, String);

    var isFollowing = Followers.findOne({coderId: doc.coderId, followerId: userId})
    return (userId === doc.followerId && ! isFollowing);
  },
  remove: function (userId, doc) {
    check(doc.followerId, String);
    return userId === doc.followerId;
  }
});
