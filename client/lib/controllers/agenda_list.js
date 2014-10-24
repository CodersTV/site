AgendaListController = FastRender.RouteController.extend({
  waitOn: function () {
    return [
      Meteor.subscribe('schedule', null, true),
      Meteor.subscribe('Users')
    ];
  },

  data: function () {
  },

  action: function () {
    this.render();
  }
});
