/*****************************************************************************/
/* schedule: Event Handlers and Helpers */
/*****************************************************************************/
Template.schedule.events({
  'submit #schedule-form': function (e, t) {
    event.preventDefault();

    var form = {};
    var $form = $(event.target);
    var values = $form.serializeArray();
    var $submitButton = $form.find('#schedule-broadcast');

    $submitButton.attr('disabled', 'disabled');
    $('body').css({'cursor': 'wait'});

    _.each(values, function (doc) {
      form[doc.name] = doc.value;
    });
    form.date = new Date(form.date);

    Schedule.insert(form, function (err, res) {
      $submitButton.removeAttr('disabled');
      $('body').css({'cursor': 'auto'});
      if (err) {
        alertify.error(err.reason);
      } else {
        alertify.success('Broadcast successfully scheduled.');
        Router.go('agenda', { _id: res });
        return true;
      }
    });
  }
});

Template.schedule.helpers({
  /*
   * Example: 
   *  items: function () {
   *    return Items.find();
   *  }
   */
});

/*****************************************************************************/
/* schedule: Lifecycle Hooks */
/*****************************************************************************/
Template.schedule.created = function () {
};

Template.schedule.rendered = function () {
  _.defer(function () {
    this.$('.datetimepicker').datetimepicker({
      sideBySide: true
    });
  });
};

Template.schedule.destroyed = function () {
};
