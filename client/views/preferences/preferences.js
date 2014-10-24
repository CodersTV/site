
// Username form
Template.choose_username_form.events({
  'submit form': function (event) {
    event.preventDefault();

    var confirm = window.confirm('You can only choose your username one time! Are you sure?');
    if (! confirm) {
      return;
    }

    var username = $('input[name=username]').val();
    Meteor.call('setUsername', username, function (err, res) {
      if (err) {
        return alertify.error(err.reason);
      }
      return alertify.success(res);
    });
  }
});

// Description form
Template.channel_description_form.helpers({
  myDescription: function () {
    var user = Meteor.user();
    if (user) {
      return user.profile.description;
    }
  }
});

Template.channel_description_form.events({
  'submit #description-form': function (event) {
    event.preventDefault();

    var $form = $(event.target),
    description = $form.find('textarea#user-description').val();

    try {
      Meteor.users.setDescription(description);
      alertify.success('You have saved your description successfully');
    } catch (err) {
      alertify.error(err.reason);
    }
  }
});

Template.people_you_follow.followers = function () {
  return Followers.find();
};

Template.people_you_follow.events({
  'click ul#followers .unfollow-coder button': function (event) {
    var currentCoder = this._id;
    Follower.unset(currentCoder);
  }
});

Template.paypal_form.helpers({
  currencies: ['USD', 'BRL']
});

Template.paypal_form.events({
  'change #allow-paypal': function (event, t) {
    var 
    self = event.target,
    checked = $(self).prop('checked'),
    group = t.find('.show-hide-group')
    ;

    if (checked) {
      $(group).removeClass('hide');
    } else {
      $(group).addClass('hide') 
    }
  },
  'change #currency': function (event, t) {
    var
    self = event.target,
    addon = t.find('#amount-addon')
    ;

    $(addon).text(self.value); 
  },
  'submit #paypal-preferences': function (event, t) {
    event.preventDefault();
    var 
    form = event.target
    params = {},
    checked = $(form).find('#allow-paypal').prop('checked')
    ;

    $.each($('#paypal-preferences').serializeArray(), function(_, kv) {
      params[kv.name] = kv.value;
    });
    Meteor.call('savePaypal', checked, params, function (err, res) {
      if (err) {
        return alertify.error(err.reason);
      }
      return alertify.success('Paypal configuration saved.');
    });
  }
});

