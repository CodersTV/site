BasicController = FastRender.RouteController.extend({
  beforeAction: function () {
    Meteor.subscribe('Users')
  }
});

