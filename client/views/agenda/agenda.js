/*****************************************************************************/
/* Agenda: Event Handlers and Helpers */
/*****************************************************************************/
Template.agenda.events({
  'click .js-user-profile': function () {
    var coderId = Router.current().data().owner;
    Router.go('coder', { coderId: coderId });
  },
  'click .follow-coder': function (event) {
    var coderId = Router.current().data().owner;

    if (Meteor.user()) {
      $(event.target).popover('hide');
    } else {
      $(event.target).popover({
        animation: true,
        placement: 'left',
        content: function () {
          return 'You first need to login before following coders.';
        }
      });

      Meteor.setTimeout(function () {
        $(event.target).popover('hide');
      }, 5 * 1000);

      trackEvent('follow-coder-fail', {coderId: coderId});
      return;
    }

    Follower.set(coderId);
    trackEvent('follow-coder', {coderId: coderId});
  },
  'click .unfollow-coder': function () {
    var currentCoderId = Router.current().data().owner;

    Follower.unset(currentCoderId);
    trackEvent('unfollow-coder', {coderId: currentCoderId});
  },
  'click .js-cancel-event': function () {
    var _id = Router.current().data()._id;
    var isSure = confirm('Are you sure you want to cancel this event?');

    if (! isSure) {
      return false;
    }

    Schedule.cancel(_id);
  },
  'click .js-uncancel-event': function () {
    var _id = Router.current().data()._id;

    Schedule.uncancel(_id);
  },
  'click .download-ics': function(event) {
    event.preventDefault();
    var blob = new Blob([ics.createFile(this)],
      {type: 'text/calendar;charset=UTF-8'});
    return saveAs(blob, 'coderstv-calendar.ics');
  }
});

Template.agenda.helpers({
  formatDate: function (date) {
    return date && moment(date).format('MMMM Do YYYY, h:mm:ss a') || '';
  }
});

/*****************************************************************************/
/* Agenda: Lifecycle Hooks */
/*****************************************************************************/
Template.agenda.created = function () {
};

Template.agenda.rendered = function () {
  if (window.DISQUS) {
    Disqus.reset();
  }

  if (Session.equals('mustLoadDisqus', false)) {
    return;
  }
  Session.set('mustLoadDisqus', false);

  Disqus.loadJs();
};

Template.agenda.destroyed = function () {
};

Disqus = {};
Disqus.loadJs = function () {
  /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
  var disqus_shortname = 'coderstv'; // required: replace example with your forum shortname

  /* * * DON'T EDIT BELOW THIS LINE * * */
  (function() {
    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
    dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
  })();
};

Disqus.SSO = function () {
  Meteor.call('disqusSSO', function (err, res) {
    if (err) {
      console.log(err);
      return;
    }

    Session.set('disqusSSO', res);
    window.disqus_config = function () {
      this.page.identifier = Path();
      this.page.url = Meteor.absoluteUrl() + Path().substr(1);
      if (! _.isEmpty(res)) {
        this.page.remote_auth_s3 = res.auth;
        this.page.api_key = res.pubKey;
      }
    };
  });
};

Disqus.reset = function () {
  var disqusSSO = Session.get('disqusSSO');
  try {
    DISQUS.reset({
      reload: true,
      config: function () {
        this.page.identifier = Path();
        this.page.url = Meteor.absoluteUrl() + Path().substr(1);
        if (! _.isEmpty(disqusSSO)) {
          this.page.remote_auth_s3 = disqusSSO.auth;
          this.page.api_key = disqusSSO.pubKey;
        }
      }
    });
  } catch (err) {

  }
};
