Languages = new Meteor.Collection('languages');

/*
 * Add query methods like this:
 *  Languages.findPublic = function () {
 *    return Languages.find({is_public: true});
 *  }
 */
Language = (function() {

  function set (name) {
    return Languages.insert({ name : name , watchers : 0, videos: 0 });
  }

  function get (name) {
    return Languages.findOne({ name : name });
  }

  function decWatchers (name) {
    var language = Languages.findOne({name: name});
    if (language.watchers === 0) {
      return;
    }

    var decremented = decrementCounter('lang_' + name + '_watchers');

    return Languages.update({ name : name }, { $set : { watchers : decremented } });
  }

  function incWatchers (name) {
    var incremented = incrementCounter('lang_' + name + '_watchers');

    return Languages.update({ name: name }, { $set : { watchers : incremented } });
  }

  function incVideos (name) {
    var incremented = incrementCounter('lang_' + name + '_videos');

    return Languages.update({name: name}, {$set: {videos: incremented}});
  }

  function decVideos (name) {
    var decremented = decrementCounter('lang_' + name + '_videos');

    return Languages.update({name: name}, {$set: {videos: decremented}});

  }

  return {
    set : set,
    get : get,
    incWatchers : incWatchers,
    decWatchers: decWatchers,
    incVideos : incVideos,
    decVideos: decVideos
  };
})();
