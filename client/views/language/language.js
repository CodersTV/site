
function escapeRegExp(str) {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

Template.language.liveList = function () {
    var pattern = Session.get('currentLanguage'),
        regex = new RegExp(escapeRegExp(pattern), 'i');

    return Channels.find({
        language: regex,
        isLive: true
    });
};

Template.language.pastList = function () {
    var pattern = Session.get('currentLanguage'),
        regex = new RegExp(escapeRegExp(pattern), 'i');

    return Channels.find({
        language: regex,
        isLive : false
    }, { 
        limit : 6
    });
};
