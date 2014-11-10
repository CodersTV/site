BasicController = RouteController.extend({
  beforeAction: function () {
    Meteor.subscribe('Users')
  }
});

