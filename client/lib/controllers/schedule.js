ScheduleController = RouteController.extend({
  waitOn: function () {
    return [
      Meteor.subscribe('schedule')
    ];
  },

  data: function () {
  },

  onBeforeAction: function () {
    if (! Meteor.user()) {
      this.redirect(Router.routes.login.path());
      Session.set('nextPage', this.path);
      this.stop();
      return;
    }
  }
});
