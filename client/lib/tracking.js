trackWoopra = function (name, options) {
    // woopra
    var user = Meteor.user(),
        identification = {};

    if (Meteor.user()) {
        identification = {
            name: user.profile.name,
            email: user._id
        };
        if (user.profile && user.profile.username) {
            identification.username = user.profile.username;
        }
    }


    woopra.identify(identification);
    if (! name) {
        return woopra.track();
    }

    return woopra.track(name, options);
};

trackGAEvent = function (category, action, label) {
    _gaq.push(['_trackEvent', category, action, label]);    
};

trackEvent = function (name, options) {
    if (preventTracking()) {
        return;
    }

    //trackWoopra(name, options);
    var label = _.values(options).join('_'),
        action = 'click';
    return trackGAEvent(name, action, label);
};

preventTracking = function () {
    if (_.isEmpty(Meteor.absoluteUrl().match('http://coderstv.com/'))) {
        console.debug('In localhost not tracking GA');
        return true;
    }

    return false;
};

trackPageview = function (path) {
    var settings = Meteor.settings,
        UA = null;

    if (preventTracking()) {
        return;
    }

    if (settings && settings.public) {
        UA = Meteor.settings.public.ga;
    } 
    else {
        // production
        UA = 'UA-40349262-1';
    }

    // ga
    window._gaq = window._gaq || [];
    window._gaq.push(['_setAccount', UA]);
    window._gaq.push(['_trackPageview', path]);

    // woopra
    trackWoopra();
};

