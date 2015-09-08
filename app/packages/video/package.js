Package.describe({
    summary: "video"
});

Package.on_use(function (api, where) {
    api.use('jquery', 'client');

    api.add_files('lib/video.js', 'client');
});