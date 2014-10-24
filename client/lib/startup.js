if (Meteor.AppCache) {
  Meteor.AppCache.config({
    chrome : true,
    firefox : true,
    ie : true,
    chromium : true,
    safari : true
  });
}


Session.set('currentCoder', '');
Session.set('currentVideo', '');
Session.set('channelSearchQuery', '');
Session.set('languageSearchQuery', '');
Session.set('YTApiReady', false);
Session.set('channelRendered', false);
Session.set('playerReady', false);
Session.set('disqusSSO', false);

Accounts.ui.config({
  requestPermissions : {
    google: [
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/plus.login']
  },
  requestOfflineToken: {
    google: true
  }
});

TITLE = ' | CodersTV';
