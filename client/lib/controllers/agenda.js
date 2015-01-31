AgendaController = RouteController.extend({
  waitOn: function () {
    return [
      Meteor.subscribe('OneScheduleWithProfile', this.params._id),
      Meteor.subscribe('Followers')
    ];
  },

  data: function () {
    return Schedule.findOne();
  }

});
