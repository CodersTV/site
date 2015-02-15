nlform = null;

Template.index.rendered = function () {
    if (! nlform) {
      nlform = new NLForm(this.find('#nl-form'))
    }
};

Template.index.destroyed = function () {
  nlform = null;
};

Template.index.liveList = function() {
	return Channels.find({
		isLive : true
	}, {
		sort : {
			visualizations : -1
		},
		limit : 3
	});
};

Template.index.pastList = function() {
	return Channels.find({
		isLive : false
	}, {
		sort : {
			finishedAt : -1
		},
		limit : 3
	});
};

Template.index.featuredBroadcast = function () {
    return Channels.findOne({featured: true});
};

Template.index.helpers({
  scheduledEvents: function () {
    return Schedule.find({
      date: {$gte: new Date()}
    }, {sort: {date: 1} , limit: 4});
  },
  hasScheduledEvents: function () {
    return Schedule.find({
      date: { $gte: new Date() }
    }).count() > 0;
  }
});

Template.index.events({
    'submit #nl-form': function (event, t) {
        event.preventDefault();

        var form = {},
            $formDiv = $(t.find('#nl-form')),
            values = $formDiv.serializeArray();

        _.each(values, function (doc) {
            form[doc.name] = doc.value;
        });

        trackEvent('index-search', {action: form.action, language: form.language});
        if (form.action === 'watch') {
            if (! form.language || form.language === 'any language') {
                Router.go(Router.routes.codersList.path());
                return;
            }
            Router.go(Router.routes.search.path({keyword: form.language}));
        } else {
            Router.go(Router.routes.dashboard.path());
        }
    }
});
