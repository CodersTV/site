/*
 * Cleanup of broadcasts. If channel is live, check if user forgot to end it.
 */

// var CLEANUP_INTERVAL = 5 * 60 * 1000,
var CLEANUP_INTERVAL = 60 * 1000;
var moment = Meteor.require('moment');
var Fiber = Npm.require('fibers');
var debug = Meteor.require('debug')('ct:cleanup.js');

Meteor.setInterval(function () {
  Channels.find({isLive: true}).forEach(function (channel) {
    try {
      var user = Meteor.users.findOne({ _id: channel.owner });
      if (! user) {
        throw new Meteor.Error(500, 'User not found. Cannot cleanup the channel.');
      }
      var video = Youtube.getVideo(channel.URL, user);
    } catch (err) {
      if (err.error === 404) {
        Channel.unset(channel._id);
        return;
      }

      debug('Channel cleanup error:', err, user);
      return;
    }

    var status = video.status;
    var tags = video.snippet.tags;

    if (status.uploadStatus === 'processed') {
      Channel.unset(channel._id);
    }
  });
}, CLEANUP_INTERVAL);
