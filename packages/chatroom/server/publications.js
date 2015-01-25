superChatStream = new Meteor.Stream('superChatStream');

superChatStream.permissions.read(function (eventName) {
    return true;
});

superChatStream.permissions.write(function (eventName) {
    if (! this.userId) {
        return false;
    }

    var user = Meteor.users.findOne({_id: this.userId});
    if (! user.superchat) {
        user.superchat = {};
        Meteor.users.update({_id: user._id}, {$set: {superchat: {}}});
    }

    return true;
});

superChatStream.addFilter(function (eventName, args) {
    var user = Meteor.users.findOne({_id: this.userId}),
        message = args[0];

    if (! this.userId ||
        (typeof user.superchat.canChat !== 'undefined' && !user.superchat.canChat),
        message.length === 0) {
        return [];
    }

    var messagesInRow = user.superchat.messagesInRow,
        lastMessageOn = user.superchat.lastMessageOn,
        now = +(new Date());

    if (messagesInRow >= 3) {
        if (now - lastMessageOn <= 1000) {
            Meteor.users.update({_id: user._id}, {
                $set: {
                    'superchat.lastMessageOn': +(new Date()),
                    'superchat.canChat': false,
                    'superchat.whenCanChat': now + (60 * 1000)
                }
            });
        } else {
            Meteor.users.update({_id: user._id}, {
                $set: {'superchat.lastMessageOn': +(new Date()), 'superchat.messagesInRow': 1}
            });
        }
    } else {
        Meteor.users.update({_id: user._id}, {
            $set: {'superchat.lastMessageOn': +(new Date())},
            $inc: {'superchat.messagesInRow': 1}
        });
    }

    args.push('says');
    return args;
});
