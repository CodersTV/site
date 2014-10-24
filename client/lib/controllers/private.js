PrivateController = BasicController.extend({
  onBeforeAction: function () {
    document.title = 'Private room' + TITLE;
  },
  data: function () {
    return HelpRequests.findOne(this.params._id);
  },
  waitOn: function ()  {
    return [
      Meteor.subscribe('HelpRequests'),
      Meteor.subscribe('Documents'),
      Meteor.subscribe('Users')
    ];
  }
});
