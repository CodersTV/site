
Template.languages.list = function () {
    return Languages.find({videos: {$gt: 0}}, {sort: {videos: -1}});
};
