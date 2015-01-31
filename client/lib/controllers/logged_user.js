LoggedUserController = RouteController.extend({
  onBeforeAction: function () {
    if (! Meteor.user()) {
      this.redirect(Router.routes.login.path());
      Session.set('nextPage', this.path);
      this.stop();
      return;
    }
  }
});

DashboardController = LoggedUserController.extend({
  template: 'dashboard',
  waitOn: function () {
    return Meteor.subscribe('SelfVideos');
  }
});
