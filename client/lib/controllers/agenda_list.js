AgendaListController = RouteController.extend({
  waitOn: function () {
    return Meteor.subscribe('EntireAgendaWithProfiles');
  }
});
