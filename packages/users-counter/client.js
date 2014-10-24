var UPDATE_INTERVAL = 3000;

var updateViewer = function (viewerId, path, interval) {
    if (interval) {
        Meteor.clearInterval(interval);
    }

    var interval = Meteor.setInterval(function () {
        Meteor.call('heartbeat', viewerId, path, function (err, res) {});
    }, UPDATE_INTERVAL);
    return interval;
};

Meteor.startup(function () {
//    var uuid = Meteor.uuid(),
//        interval = null;
//
//    Deps.autorun(function () {
//        var path = Path();
//        Meteor.subscribe('Viewers', path);
//        interval = updateViewer(uuid, path, interval);
//    });
});
