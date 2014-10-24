Meteor.setInterval(function () {
    Meteor.users.find({'superchat.canChat': false}).forEach(function (user) {
        var now = +(new Date());
        if (user.superchat.whenCanChat >= now) {
            return;
        }

        Meteor.users.update({_id: user._id}, {
            $set: {'superchat.canChat': true, 'superchat.messagesInRow': 0}
        });
    });
}, 1000)
