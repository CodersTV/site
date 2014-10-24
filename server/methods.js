
Meteor.methods({
  getVideo: function (videoID) {
    return Youtube.getVideo(videoID);
  }, 
  createChannel: function (form) {
    var shortRe = new RegExp('http://youtu.be/(.+)');
    var completeRe = new RegExp('^https?://w{0,3}\.?youtube\.com/watch\?.*v=(.*[^&])&?.*');
    var match = shortRe.exec(form.URL) || completeRe.exec(form.URL);
    
    if (! match) {
      throw new Meteor.Error(400, 'Invalid URL.');
    }
    
    var videoID = match[1];
    var video = Youtube.getVideo(videoID);
    
    if (video.snippet.tags && !_.contains(_.values(video.snippet.tags), '#hoa'))
      throw new Meteor.Error(400, 'That URL does not seems to be a valid Hangout on Air.');
    else if (video.kind != 'youtube#video')
      throw new Meteor.Error(400, 'That URL does not seem a valid Youtube video.');
        
    return Channel.set({
      owner: this.userId,
      title: video.snippet.title,
      URL: videoID,
      language: form.language,
      description: form['video-description']
    });
  },
  stopChannel: function () {
    // TODO: remove this method and allow on collection
    return Channel.unsetByOwner(Meteor.userId());
  },
  setUsername: function (username) {
    var user = Meteor.user();

    if (user.username) {
      throw new Meteor.Error(400, 'User already has username defined.');
    }
    
    if (Meteor.users.findOne({$or: [{_id: username}, {'profile.username': username}]})) {
      throw new Meteor.Error(400, 'There is already an user with that username');
    }
    
    Meteor.users.update({_id: user._id}, {
      $set: {'profile.username': username}
    });
    
    return 'You have changed your username successfully. Your username now is ' + username;
  },
  requestVideoDeletion: function (videoId) {
    try {
      //TODO: Meteor.call this
      Youtube.getVideo(videoId);
    } catch (err) {
      if (err.error === 404) {
        Channel.removeByURL(videoId);
      }
    } 
  },
  addUserToBeta: function (email) {
    var loggedUser = Meteor.user();

    if (! Roles.userIsInRole(loggedUser, ['admin'])) {
      throw new Meteor.Error(403, 'Get out!');
    }

    var emailRegex = new RegExp(email);
    var user = Meteor.users.findOne({'services.google.email': emailRegex});

    if (user) {
      Roles.addUsersToRoles(user._id, 'beta');
      return 'Added role to user';
    }

    BetaUsers.insert({ email: email });
    return 'Added user in BetaUsers';
  },
  // TODO: Remove this function, do I use it anywhere?
  updateUserPhoto: function (userId) {
    var loggedUser = Meteor.user();

    if (! Roles.userIsInRole(loggedUser, ['admin'])) {
      throw new Meteor.Error(403, 'Get out!');
    }

    var user = Meteor.users.findOne({_id: userId});
    try {
      var url = 'http://www.google.com/s2/photos/profile/' + user.services.google.id;
      Meteor.http.get(url);
      return Meteor.users.update({_id: userId}, {
        $set: {
          'superchat.pic_square': url
        }
      });
    } catch (err) {
      return Meteor.users.update({_id: userId}, {
        $set: {
          'superchat.pic_square': Superchat.defaultProfilePicture
        }
      });
    }
  },
  savePaypal: function (allow, params) {
    var loggedUser = Meteor.user();
    var update = {paypal: {}};
    var checkPattern = {
      currency: String,
      amount: String,
      email: String,
      checkboxes: String
    };

    if (allow) {
      check(params, checkPattern);
      update.paypal = {
        currency: params.currency,
        amount: parseFloat(params.amount),
        email: params.email
      }
    }

    return Meteor.users.update({ _id: loggedUser._id }, { $set: update });
  }
});

