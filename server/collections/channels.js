var Fiber = Npm.require('fibers');

/*
 * Add query methods like this:
 *  Channels.findPublic = function () {
 *    return Channels.find({is_public: true});
 *  }
 */

Channels.allow({
  insert : function (userId, doc) {
    return false;
  },
  update : function (userId, doc, field, modifier) {
    return false;
  },
  remove : function (userId, doc) {
    return doc.owner === userId;
  }
});

Channels.sendFollowEmail = function (userId, doc) {
  var followers = Followers.find({coderId: doc.owner}).fetch(),
  coder = Meteor.users.findOne({_id: doc.owner});

  _.each(followers, function (follower) {
    follower = Meteor.users.findOne({_id: follower.followerId});
    var vars = {
      userName: follower.profile.name,
      coderName: coder.profile.name,
      videoTitle: doc.title,
      videoDescription: marked(doc.description),
      coderURL: Meteor.absoluteUrl() + 'coder/' + (coder.profile.username || coder._id),
      unsubscribeCoderURL: Meteor.absoluteUrl() + 'preferences/'
    },
    subject = coder.profile.name + ' is going to broadcast "'+doc.title+'" right now on CodersTV';

    Fiber(function () {
      Email.send({
        from: 'contact@coderstv.com',
        to: follower.services.google.email,
        subject: subject,
        html: Handlebars.templates['follow'](vars)
      });
    }).run();
  });
}

Channels.before.insert(function (userId, doc) {
  check(doc.URL, String);
  check(doc.language, String);
  check(doc.description, String);

  doc.language = doc.language.split(',');
  doc.isLive = true;
  doc.watchers = 0;
  doc.visualizations = 0;
  doc.createdAt = +(new Date());
  doc.finishedAt = 0;
  doc.featuredImage = 'http://img.youtube.com/vi/' + doc.URL + '/hqdefault.jpg';
});

Channels.after.insert(function (userId, doc) {
  Channels.sendFollowEmail(userId, doc);
});

Channels.after.insert(function (userId, doc) {
  var user = Meteor.users.findOne(userId);
  var usernameOrId = user.profile.user || userId;

  Twitter.postAsync(
    TwitterClient,
    'statuses/update',
    {
      status: 'It\'s starting: http://coderstv.com/coder/' + usernameOrId + ' | ' + doc.title
    },
    function (err, tweet, res) {
      if (err) {
        log.log('err', 'Could not tweet: ' + tweet.text + ' - Channel: ' + doc);
      }
    }
  );
});

Channels.before.update(function (userId, doc, fieldNames, modifier, options) {
  modifier.$set = modifier.$set || {};
  if (modifier.$set.isLive === false) {
    modifier.$set.finishedAt = +(new Date());
  }
});
