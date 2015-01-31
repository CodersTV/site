
superChatMsgs = new Meteor.Collection(null);
superChatStream = new Meteor.Stream('superChatStream');

/*
 * Streams
 */

superChatStream.on('chat', function (message, host, action) {
  if (arguments.length === 0) {
    return;
  }

  superChatMsgs.insert({
    msg: message,
    owner: this.userId,
    host: host,
    action: action,
    time: new Date()
  });
  Template.chatroom.scrollToBottom();
  Template.chatroom.removeLastMessage();
});

/*
 * UI
 */

Template.chatroom.scrollToBottom = function () {
  _.defer(function() {
    var chat = $('#messages');
    chat.scrollTop(chat.get(0).scrollHeight);
  });
};

Template.chatroom.removeLastMessage = function () {
  var allMessages = superChatMsgs.find().fetch();

  if (allMessages.length >= Superchat.messageLimitOnScreen) {
    var lastMessage = allMessages[0];
    superChatMsgs.remove(lastMessage._id);
  }
};

Template.chatroom.sendMsg = function () {
    var user = Meteor.user();
    if (! user ||
        (user.superchat && typeof user.superchat.canChat !== 'undefined' && !user.superchat.canChat)) {
        return;
    }

    var $msg = $('#msg-input textarea'),
        message = $msg.val();

    $msg.val('');

    if (! message) {
      return;
    }

    var owner = Meteor.userId(),
        action = 'says',
        coder = Session.get('coder'),
        host = coder._id;

    Template.chatroom.removeLastMessage();
    superChatMsgs.insert({
      msg: message,
      owner: owner,
      host: host,
      action: action,
      time: new Date()
    });
    superChatStream.emit('chat', message, host);
    Template.chatroom.scrollToBottom();

};

Template.chatroom.insertAtCaret = function(txtarea, text) {
  // got from here http://stackoverflow.com/questions/1064089/inserting-a-text-where-cursor-is-using-javascript-jquery
  var scrollPos = txtarea.scrollTop;
  var strPos = 0;
  var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ? "ff" : (document.selection ? "ie" : false ) );
  if (br == "ie") {
    txtarea.focus();
    var range = document.selection.createRange();
    range.moveStart('character', -txtarea.value.length);
    strPos = range.text.length;
  } else if (br == "ff")
    strPos = txtarea.selectionStart;

  var front = (txtarea.value).substring(0, strPos);
  var back = (txtarea.value).substring(strPos, txtarea.value.length);
  txtarea.value = front + text + back;
  strPos = strPos + text.length;
  if (br == "ie") {
    txtarea.focus();
    var range = document.selection.createRange();
    range.moveStart('character', -txtarea.value.length);
    range.moveStart('character', strPos);
    range.moveEnd('character', 0);
    range.select();
  } else if (br == "ff") {
    txtarea.selectionStart = strPos;
    txtarea.selectionEnd = strPos;
    txtarea.focus();
  }
  txtarea.scrollTop = scrollPos;
};

Template.chatroom.rendered = function () {
  var self = this;

  _.defer(function () {
    self.$('#messages, #users-list').niceScroll({
      autohidemode: false,
      cursoropacitymin: 0.3,
      cursoropacitymax: 0.3
    });
  });

  self.banDeps = Deps.autorun(function banUserWhenFlood () {
    if (! Session.equals('chatSubsReady', true)) {
      return;
    }

    var user = Meteor.user();
    var $msg = $('#msg-input textarea');
    var $sendMsgButton = $('.send-msg');

    if (user && user.superchat && user.superchat.canChat === false) {
      $msg.attr('disabled', 'disabled');
      $msg.val('You are banned due to flooding.');
      $sendMsgButton.attr('disabled', 'disabled');
    } else {
      $msg.removeAttr('disabled');
      $msg.val('');
      $sendMsgButton.removeAttr('disabled');
    }
  });
};

Template.chatroom.destroyed = function () {
  var self = this;

  self.$('#messages, #users-list').getNiceScroll().hide();

  self.banDeps.stop();
};

Template.chatroom.helpers({
  msgs: function () {
    var coder = Session.get('coder');
    return superChatMsgs.find({host: coder._id}, {limit: Superchat.messageLimitOnScreen});
  },
  getProfile: function (userId) {
    return userId && Meteor.users.findOne({_id: userId}).superchat;
  },
  onlineUsers: function () {
    var presences = Meteor.presences.find({userId: {$exists: true}}).fetch(),
        ids = _.pluck(presences, 'userId'),
        query = [];

    if (_.isEmpty(ids))
      return;

    query = ids.map(function (id) {
      return { _id: id };
    });

    window.QUERY = query;
    return Meteor.users.find({ $or: query });
  }
});

Template.chatroom.events({
  'click .send-msg': function () {
    Template.chatroom.sendMsg();
  },
  'keyup #msg-input textarea': function (event, t) {
    var target = event.target,
        len = target.value.length;

    if (len > 500) {
      target.value = target.value.substring(0, 500);
    } else {
      t.$('.messages-counter').text(500 - len);
    }
  },
  'click #chat-info .online-users button' : function (e, t) {
    t.$('#users-list').toggle();
  },
  'focus #msg-input textarea': function (event, t) {
    var self = event.target;
    KeyboardJS.on('shift + enter', function(){
      Template.chatroom.insertAtCaret(self, '\n');
      return false;
    });

    KeyboardJS.on('enter', function () {
      if (t.$(self).attr('disabled') !== 'disabled')
       Template.chatroom.sendMsg();
      return false;
    });
  },
  'blur #msg-input textarea': function (event) {
      KeyboardJS.clear('enter');
      KeyboardJS.clear('shift + enter');
  }
});


