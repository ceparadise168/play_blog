var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var pipe = require('./pipe');

router.use('/users', require('./users'));
router.use('/roles', require('./roles'));

/* GET home page. */
router.get('/', pipe.cookieConverter, pipe.basic, function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/home', function (req, res, next) {
    Post.find().sort('-createdAt').exec().then(function (posts) {
        res.render('../views/main/index', {
            title: '文章列表',
            posts: posts
        });
    }, next);
});

router.get('/add', function (req, res, next) {
    res.render('../views/main/add', {
        title: '新增文章'
    });
});

router.post('/add', function (req, res, next) {
    var data = req.body;

    Post.create(data).then(function (post /**建立好的資料 */) {
        res.redirect('/home');
    }, next);
});

router.get('/view', function (req, res, next) {
    var query = req.query;
    var id = query.id;

    Post.findById(id).exec().then(function (post) {
        res.render('../views/main/view', {
            title: '檢視文章',
            post: post
        });
    }, next);
});

router.get('/edit/:id', function (req, res, next) {
    var params = req.params;
    var id = params.id;

    Post.findById(id).exec().then(function (post) {
        res.render('../views/main/edit', {
            title: '檢視文章',
            post: post
        });
    }, next);
});

router.post('/edit/:id', function (req, res, next) {
    var params = req.params;
    var id = params.id;
    var data = req.body;

    Post.findById(id).exec().then(function (post) {
        post.title = data.title;
        post.content = data.content;
        post.save().then(function () {
            res.redirect('/home');
        }, next);
    }, next);
});

module.exports = router;
