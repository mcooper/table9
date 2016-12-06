module.exports = function(app) {
    app.get('/', function (req, res) {
        res.render('index.html', {
            title: '',
            description: ''
        });
    });
    app.get('/about', function (req, res) {
        res.render('about.html', {
            title: '',
            description: ''
        });
    });
};