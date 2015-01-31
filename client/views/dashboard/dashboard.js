Template.dashboard.rendered = function () {
  _.defer(function () {
    this.$('input[name=language]').tagsinput({
      trimValue: true
    });
  });
};

Template.dashboard.isBroadcasting = function () {
  return Channel.getLive(Meteor.userId());
};

Template.dashboard.pastList = function () {
  return Channels.find({ isLive : false, 'owner' : Meteor.userId() }, { sort : { finishedAt : -1 } });
};

Template.dashboard.myDescription = function () {
  var user = Meteor.user();
  if (user) {
    return user.profile.description;
  }
};

Template.dashboard.alertError = function (error) {
  var $alert = $('#create-channel #alerts .alert-danger');
  $alert.find('p').text(error);
  $alert.show();
};

Template.dashboard.alertSuccess = function (success) {
  var $alert = $('#alert-dialog-success');
  $alert.find('p').text(success);
  $alert.show();
};

Template.dashboard.events({
  'submit form': function (event) {
    event.preventDefault();
    return false;
  },
  'click #create-channel button[name=start-broadcast]' : function (event) {
    event.preventDefault();

    var form = {};
    var $target = $(event.target);
    var $formDiv = $('#create-channel');
    var values = $formDiv.serializeArray();

    $target.attr('disabled', 'disabled');
    _.each(values, function (doc) {
      form[doc.name] = doc.value;
    });

    Meteor.call('createChannel', form, function (err) {
      $target.removeAttr('disabled');

      if (err) {
        if (err.reason === 'Logout') {
          Meteor.logout();
        } else {
          alertify.error(err.reason)
        }
        return;
      }

      var liveChannelUrl = getCoderUrl(Meteor.userId());
      alertify.success('You can now be live inside Hangout window!');
      return Router.go(liveChannelUrl);
    });
  },
  'click #create-channel button[name=stop-broadcast]': function (event) {
    event.preventDefault();

    var confirm = window.confirm('Are you sure you want to stop the current Broadcast?');
    if (! confirm) {
      return;
    }

    Meteor.call('stopChannel', function (err) {
      if (err) {
        return Template.dashboard.alertError(err.reason);
      }
    });
  }
});

Template.video_thumb_dashboard.events({
  'click a.remove-video': function (event) {
    var _id = this._id;

    var confirm = window.confirm('Are you sure to remove your video from CodersTV?');
    if (! confirm) {
      return;
    }

    try {
      Channel.remove(_id);
      alertify.success('Video successfully removed.');
    } catch (err) {
      alertify.error(err.reason);
    }
  }
});
