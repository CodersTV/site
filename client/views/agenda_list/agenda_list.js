/*****************************************************************************/
/* Agenda: Event Handlers and Helpers */
/*****************************************************************************/
Template.agenda_list.events({
});

Template.agenda_list.helpers({
  scheduledEvents: function () {
    return Schedule.find({
      date: { $gte: new Date() }
    }, { sort: { date: 1 } });
  }
});

/*****************************************************************************/
/* Agenda: Lifecycle Hooks */
/*****************************************************************************/
Template.agenda_list.created = function () {
};

Template.agenda_list.rendered = function () {
};

Template.agenda_list.destroyed = function () {
};

/*****************************************************************************/
/* Agenda: Scheduled Events Sub-Template */
/*****************************************************************************/

Template.scheduled_event.rendered = function () {
  var $description = this.$('.description').get(0);

  $clamp($description, { clamp: 3 });
};

Template.scheduled_event.events({
  'click .profile': function () {
    Router.go('agenda', { _id: this._id });
  }
});
