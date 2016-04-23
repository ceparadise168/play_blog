/**
 * Created by mosluce on 2016/1/25.
 */
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

module.exports = function(req, res, next) {
    if(global.dbConnection) return next();

    //return res.send();
    //return res.render();
    //return next();

    var conn = mongoose.connection;

    conn.on('connected', function() {
        var user = require('./models/user');

        //use plugin
        user.plugin(timestamps);

        //register models
        global.User = conn.model('User', user);

        global.dbConnection = conn;


        var Schema = mongoose.Schema;

        var postSchema = new Schema({
            title: String,
            content: String
        });

        postSchema.plugin(timestamps);

        global.Post = conn.model('Post', postSchema);



        return next();
    });

    conn.on('error', function(err) {
        return next(err);
    });








    mongoose.connect('mongodb://play_blog:5566@ds029793.mlab.com:29793/play_blog');
};