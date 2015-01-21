Google = {};
GPlus = {};

(function () {
  var debug = Meteor.require('debug')('ct:google.js');
  var googleapis = Meteor.require('googleapis');
  var OAuth2Client = googleapis.OAuth2Client;
  var googleAccount = ServiceConfiguration.configurations._collection.findOne({
    service: 'google'
  });

  /*
   * Google OAuth methods
   */

  Google = {
    CLIENT_ID: googleAccount.clientId,
    CLIENT_SECRET: googleAccount.secret,
    REDIRECT_URL: '/_oauth/google?close'
  };

  Google.getOAuth2Client = function (user) {
    var isDefined = function(value, path) {
      path.split('.').forEach(function(key) { value = value && value[key]; });
      return (typeof value !== 'undefined' && value !== null);
    };

    if (! isDefined(user, 'services.google.accessToken')) {
      throw new Meteor.Error(500, 'Please, logout and login again. Something went wrong.');
    }
    if (! isDefined(user, 'services.google.refreshToken')) {
      Meteor.http.get('https://accounts.google.com/o/oauth2/revoke?token=' + accessToken);
      Meteor.users.update({_id: user._id}, {
        $unset: {'services.google.accessToken': 1}
      });
      throw new Meteor.Error(500, 'Please, logout and login again. Something went wrong.');
    }
    
    var accessToken = user.services.google.accessToken;
    var refreshToken = user.services.google.refreshToken;
    var oauth2Client = new OAuth2Client(Google.CLIENT_ID, Google.CLIENT_SECRET, Google.REDIRECT_URL);
    
    if (user.services.google.expiresAt < +(new Date())) {
      debug('Trying to refresh token', accessToken, refreshToken);
      var res = Meteor.http.call("POST", "https://accounts.google.com/o/oauth2/token",
        {params: {
          grant_type : 'refresh_token',
          refresh_token : refreshToken,
          client_id : Google.CLIENT_ID,
          client_secret : Google.CLIENT_SECRET
        }, headers: {
          "content-type": "application/x-www-form-urlencoded"
        }});
      accessToken = res.data.access_token;

      Meteor.users.update({_id: user._id}, {$set: {
        'services.google.accessToken': accessToken,
        'services.google.expiresAt': +(new Date()) + (1000 * res.data.expires_in)
      }});
    }

    oauth2Client.credentials = {
      access_token: accessToken,
      refresh_token: refreshToken
    };
    return oauth2Client;
  };

  /*
   * Youtube API
   */
  Youtube = {};

  Youtube.getClient = function () {
    var client = Async.runSync(function (done) {
      googleapis.discover('youtube', 'v3').execute(function (err, client) {
        done(err, client);
      });
    });
    if (client.error)
      throw new Meteor.Error(400, 'Youtube client not received');
    return client.result;
  };

  Youtube.getVideo = function (videoID, user) {
    var user = user || Meteor.user();
    var client = Youtube.getClient();
    var oauth2Client = Google.getOAuth2Client(user);
    var video = Async.runSync(function (done) {
      var params = { id: videoID, part: 'snippet,status,contentDetails' };

      client.youtube.videos
        .list(params)
        .withAuthClient(oauth2Client)
        .execute(function (err, result) {
          done(err, result);
        });
    });

    if (video.error)
      throw new Meteor.Error(400, 'Error on getting video: ' + video.error.message);
    if (! video.result.items)
      throw new Meteor.Error(404, 'Couldn\'t find video.');

    return video.result.items[0];
  };

  /*
   * Gplus
   */

  GPlus.getProfile = function (user) {
    var user = user || Meteor.user();

    if (_.isEmpty(user)) {
      debug('Havent found user. Returning empty gplus profile.')
      return {};
    }

    var oauth2Client = Google.getOAuth2Client(user);
    var profile = Async.runSync(function (done) {
      var clientPlus = Async.runSync(function (done) {
        googleapis.discover('plus', 'v1').execute(function (err, client) {
          done(err, client);
        });
      });

      if (clientPlus.result) {
        clientPlus.result.plus.people
          .get({ userId: 'me' })
          .withAuthClient(oauth2Client)
          .execute(function (err, result) {
            done(err, result);
          });
      }
    });

    return profile.result || {};
  }
}());
