Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound',
  yieldTemplates: {
    'header': { to: 'header' },
    'footer': { to: 'footer' }
  },
  // TODO: refactor templates to upperCamelCase
  //templateNameConverter: 'upperCamelCase',
  routeControllerNameConverter: 'upperCamelCase'
});

Router.onAfterAction(function () {
  if (! this.ready()) {
    this.render('loading');
  } else {
    this.render();
  }
});

Router.waitOn(function subscribeToSelf () {
  Meteor.subscribe('SelfUser');
});

Router.onBeforeAction(function setTitle () {
  document.title = 'Watch programming videos or broadcast your coder skills with the world | CodersTV';
});

Router.onBeforeAction(function headerActiveLi () {
  var href = Router.current().path;

  $('li.active').removeClass('active');
  $('.navbar li').find('a[href="'+href+'"]').parent().addClass('active');
});

Router.onAfterAction(function setPath () {
  var current = Router.current();
  if (! current) return;

  Path.set(current.path);
});

Deps.autorun(function () {
  var nextPage = Session.get('nextPage');
  if(Meteor.user() && nextPage) {
    Session.set('nextPage', null);
    Router.go(nextPage);
    this.stop();
  }
});

Deps.autorun(function setPresenceOnPageChange () {
  var path = Path.get(true);
  var state = {
    online: true,
    whereAt: path
  };

  Presence.state = function () {
    return state;
  };
  Meteor.call('updatePresence', state);
});

Router.onRun(function reactiveTrackPageview () {
  var current = Router.current();
  if (! current) {
    return;
  }

  var path = current.path;
  trackPageview(path);
});

Router.onAfterAction(function scrollWindowTopOnPageChange () {
  var current = Router.current();
  if (! current) {
    return;
  }

  Deps.afterFlush(function () {
    $(window).scrollTop(0);
  });
}, { except: 'coder' });

Router.map(function () {
  this.route('index', {
    path: '/',
    waitOn: function () {
      return [
        Meteor.subscribe('ChannelsWithOwner', 3),
        Meteor.subscribe('FeaturedChannelWithUser')
      ];
    }
  });

  this.route('coder', {
    controller: CoderController,
    path: '/coder/:coderId'
  });

  this.route('codersList', {
    controller: CoderListController,
    path: '/coders'
  });

  this.route('video', {
    controller: VideoController,
    path: '/video/:coderId/:videoId'
  });

  this.route('search', {
    controller: SearchController,
    path: '/search/:keyword?'
  });

  this.route('schedule', {
    controller: ScheduleController,
    path: '/schedule'
  });

  this.route('agendaList', {
    controller: AgendaListController,
    template: 'agenda_list',
    path: '/agenda'
  });

  this.route('agenda', {
    controller: AgendaController,
    template: 'agenda',
    path: '/agenda/:_id'
  });

  this.route('loading');

  this.route('dashboard', {
    controller: DashboardController
  });

  this.route('preferences', {
    controller: LoggedUserController,
    waitOn: function () {
      return [
        Meteor.subscribe('Followers'),
        Meteor.subscribe('Users')
      ];
    }
  });

  this.route('login', {
    controller: BasicController
  });

  this.route('privacy', {
    controller: BasicController
  });

  this.route('notFound', {
    controller: BasicController,
    path: '*'
  });
});
