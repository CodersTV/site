getRootUrl = function () {
  var url = Meteor.absoluteUrl();
  if ( url.lastIndexOf('/') == url.length - 1 )
    url = url.substring(0, url.length - 1);

  return url;
};

getCoderUrl = function (coderId) {
  var user = typeof coderId === 'string' ? Meteor.users.findOne({_id: coderId}) : null;

  if (! user) {
    return;
  } else if (typeof user.profile !== 'undefined' && user.profile.username) {
    return Router.routes.coder.path({coderId: user.profile.username});
  }
  return Router.routes.coder.path({coderId: user._id});
}

if (typeof Handlebars === 'undefined') Handlebars = UI;

Handlebars.registerHelper('getPaypalAmountClass', function () {
  var user = Meteor.user();

  return user && user.paypal && user.paypal.amount && '' || 'hide';
});

Handlebars.registerHelper('MeteorUserId', function () {
  return Meteor.userId();
});

Handlebars.registerHelper('encode', function (uri) {
  return encodeURIComponent(uri);
});

Handlebars.registerHelper('ROOT_URL', function () {
  return getRootUrl();
});

Handlebars.registerHelper('SITE_NAME' , function () {
  return 'CodersTV';
});

Handlebars.registerHelper('go', function(path, options) {
  return Meteor.router && Meteor.router.go(path);
});

Handlebars.registerHelper('getUsername', function () {
  return Meteor.user() && Meteor.user().profile.username;
});

Handlebars.registerHelper('getSelfUser', function () {
  return Meteor.user();
});

Handlebars.registerHelper('getFirstName', function (name) {
  return name.split(' ')[0];
});

Handlebars.registerHelper('getUser', function (userId) {
  return Meteor.users.findOne({_id: userId});
});

Handlebars.registerHelper('getCoderChannelURL', function (coderId) {
  return getCoderUrl(coderId);
});

Handlebars.registerHelper('getVideoUrl', function (owner, videoId) {
  var user = Meteor.users.findOne({_id: owner}),
  username = owner;

  if (user && user.profile && user.profile.username) {
    username = user.profile.username;
  }
  return Router.routes.video.path({coderId: username, videoId: videoId});
});

Handlebars.registerHelper('fromNow', function (timestamp) {
  return timestamp && moment(timestamp).fromNow() || '';
});

Handlebars.registerHelper('getUserDescription', function () {
  var currentCoderId = Session.get('currentCoder'),
  user = Meteor.users.findOne({_id: currentCoderId});

  return user && user.profile && user.profile.description;
});

UI.registerHelper('isFollowingCoder', function (_id) {
  return !! Follower.get(_id);
});

UI.registerHelper('getCoder', function () {
  var coderId = Router.current().params.coderId;

  return coderId && Meteor.users.findOneFromCoderId(coderId);
});

UI.registerHelper('getChannel', function () {
  var videoId = Router.current() && Router.current().params.videoId;
  var query = {};

  if (videoId) {
    query._id = videoId;
  } else {
    query.isLive = true
  }

  return Channels.findOne(query);
});
