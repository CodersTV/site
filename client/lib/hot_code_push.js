var reloadWhenPossible = false;

var handleMigration = function () {
  var pathsToNotReload = [
    Router.routes.coder.name, 
    Router.routes.video.name,
    Router.routes.dashboard.name,
    Router.routes.schedule.name
  ];

  if (reloadWhenPossible) {
    return window.location.reload();
  }

  if (Meteor._reload) {
    Meteor._reload.onMigrate('session', function() {
      reloadWhenPossible = true;

      if (_.contains(pathsToNotReload, Router.current().route.name)) {
        return [false, {keys: []}];
      }

      return [true, {keys : []}];
    });

    (function() {
      var migrationData = Meteor._reload.migrationData('session');
      if (migrationData && migrationData.keys) {
        Session.keys = migrationData.keys;
      }
    })();
  }
};

Deps.autorun(function () {
  if (! Router.current()) {
    return;
  }

  handleMigration();
});
