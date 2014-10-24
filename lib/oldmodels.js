// Calendar
//if (typeof Calendar !== 'undefined') {
//    Calendar.allow({
//        insert: function (userId, doc) {
//            check(doc.title, String);
//            check(doc.start, Date);
//            check(doc.allDay, Boolean);
//            check(doc.description, String);
//            return userId === doc.owner && Calendar.find({ owner: userId, start: {$gt: new Date()} }).count() < 3;
//        }
//    });
//
//    Calendar.before('insert', function (userId, doc) {
//        doc.owner = userId;
//    });
//}
