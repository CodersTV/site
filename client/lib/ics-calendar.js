ics = {};

ics.createFile = function (data) {
  'use strict';
  var calendar  = 'BEGIN:VCALENDAR\r\n' +
'CALSCALE:GREGORIAN\r\n' +
'PRODID:-//CodersTV//Calendar CodersTV//EN\r\n' +
'VERSION:2.0\r\n' +
'BEGIN:VEVENT\r\n' +
'LOCATION:CodersTV - http://coderstv.com\r\n' +
'DTSTART;TZID=America/Sao_Paulo:'+ moment().add(1, 'day').format('YYYYMMDDTHHmmss') + '\r\n' +
'DTEND;TZID=America/Sao_Paulo:'+ moment().add(1, 'day').format('YYYYMMDDTHHmmss') + '\r\n' +
'DESCRIPTION: '+ data.description.substring(0, 50) + '\r\n' +
'SUMMARY:CodersTV - '+ data.title.substring(0, 25) + ' \r\n' +
'BEGIN:VALARM\r\n' +
'TRIGGER:-PT1H\r\n' +
'ACTION:DISPLAY\r\n' +
'END:VALARM\r\n' +
'ORGANIZER;CN="CodersTV":mailto:help@coderstv.com\r\n' +
'END:VEVENT\r\n' +
'END:VCALENDAR\r\n';
  return calendar;
};
