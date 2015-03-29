SearchController = RouteController.extend({
  template: 'channels',
  waitOn: function () {
    return Meteor.subscribe('ChannelsSearchWithUsers', this.params.keyword);
  }
});

