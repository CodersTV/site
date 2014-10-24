
Template.channels.liveList = function () {
    return Channels.find({isLive : true}, {sort: {watchers: 1}});
};

Template.channels.pastList = function () {
    return Channels.find({isLive: false}, {sort: {finishedAt: -1}});
};

