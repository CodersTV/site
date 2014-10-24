LoggedUserController = BasicController.extend({
  onBeforeAction: function () {
    if (! Meteor.user()) {
      this.redirect(Router.routes.login.path());
      Session.set('nextPage', this.path);
      this.stop();
      return;
    }
  }
});
