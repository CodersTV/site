Utils = {};

Utils.parseVideoDuration = function (duration) {
  if (! duration) {
    return {};
  }
  var matches = duration.match(/[0-9]+[HMS]/g);
  var parsed = {
    hours: '00',
    minutes: '00',
    seconds: '00'
  };

  _.each(matches, function (part) {
    var unit = part.charAt(part.length-1);
    var amount = parseInt(part.slice(0, -1));
    amount = ('0' + amount).slice(-2);

    if (unit === 'H') {
      parsed.hours = amount;
    } else if (unit === 'M') {
      parsed.minutes = amount;
    } else {
      parsed.seconds = amount;
    }
  });

  return parsed;
};
