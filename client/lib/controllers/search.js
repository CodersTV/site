SearchController = ChannelController.extend({
  template: 'channels',
  onBeforeAction: function () {
    var keyword = this.params.keyword;
    Session.set('channelSearchQuery', keyword);
    document.title = 'Searching for ' + keyword + TITLE;
  }
});

