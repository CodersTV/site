Channels = new Meteor.Collection('channels');
Tags.TagsMixin(Channels);

Channels.allowTags(function (userId) {
  return !! userId;
});

/*
 * Add query methods like this:
 *  Channels.findPublic = function () {
 *    return Channels.find({is_public: true});
 *  }
 */
Channel = (function () {
  function _validate (doc) {
    if ( !doc.title )
      throw new Meteor.Error(400, 'Title is not valid.');
    if ( !doc.URL )
      throw new Meteor.Error(400, 'Link is not valid.');
    if ( getLive(doc.owner) )
      throw new Meteor.Error(400, 'User is already broadcasting.');
    if (Channels.findOne({URL: doc.URL}))
      throw new Meteor.Error(400, 'The video has already been published');
  }

  function get (coderId, videoId) {
    var filter = {owner: coderId, isLive: true};

    if (videoId) {
      filter._id = videoId;
      filter.isLive = false;
    }

    return Channels.findOne(filter);
  }

  function set (doc) {
    _validate(doc);

    Language.incVideos(doc.language);
    return Channels.insert(doc);
  }

  function unset (channelId) {
    return Channels.update({ _id : channelId }, { $set : { isLive : false } });
  }

  function unsetByOwner (coderId) {
    return Channels.update({owner: coderId, isLive: true}, {$set: {isLive: false}});
  }

  function remove (channelId) {
    return Channels.remove({_id: channelId});
  }

  function removeByURL (URL) {
    var channel = Channels.findOne({URL: URL});
    if (channel) {
      Language.incVideos(channel.language, -1);
      Channels.remove(channel._id);
      return true;
    }
    return false;
  }

  function getLive (coderId) {
    return Channels.findOne({ 'owner' : coderId , isLive : true });
  }

  function getLiveCount () {
    return Channels.find({ isLive : true }).count();
  }

  function getPast () {
    return Channels.find({ 'owner' : Meteor.userId() , isLive : false });
  }

  function incVisualizations (channelId) {
    var incremented = incrementCounter('channel_' + channelId + '_visualizations');

    return Channels.update({ _id : channelId }, { $set : { visualizations : incremented } });
  }

  function incWatchers (channelId) {
    var incremented = incrementCounter('channel_' + channelId + '_watchers');

    return Channels.update({ _id : channelId }, { $set : { watchers : incremented } });
  }

  function decWatchers (channelId) {
    var channel = Channels.findOne({_id: channelId});
    if (channel.watchers === 0) {
      return;
    }

    var decremented = decrementCounter('channel_' + channelId + '_watchers');
    return Channels.update({ _id : channelId }, { $set : { watchers : decremented } });
  }

  return {
    get: get,
    set : set,
    unset : unset,
    unsetByOwner : unsetByOwner,
    getLive : getLive,
    getLiveCount : getLiveCount,
    getPast : getPast,
    incVisualizations : incVisualizations,
    incWatchers : incWatchers,
    decWatchers: decWatchers,
    remove : remove,
    removeByURL : removeByURL
  };
})();

