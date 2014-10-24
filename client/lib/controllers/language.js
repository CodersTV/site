LanguageController = BasicController.extend({
  waitOn: function () {
    return [
      Meteor.subscribe('Languages'),
      Meteor.subscribe('Channels'),
      Meteor.subscribe('Users')
    ];
  },
  onBeforeAction: function () {
    var language = this.params.language || '';

    language = language.toLowerCase();
    Session.set('currentLanguage', language); 
    if (language) {
      document.title = language + TITLE;
    } else {
      document.title = 'Languages' + TITLE;
    }
  }
});
