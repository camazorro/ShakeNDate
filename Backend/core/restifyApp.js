/**
 * Created by camazorro on 9/12/15.
 */
var restify = require('restify');

module.exports = function(registerRoutes,db){
    var self = {
        initializeApp: function(){

            db.init();

            var server  =restify.createServer({
                name: 'ShakeNDate',
                version: '2.0.0'
            });

            server.use(restify.queryParser());
            server.use(restify.bodyParser({mapParams: false}));

            registerRoutes(server);

            var port = '3000';

            server.listen(port);
        }
    }
    return self;
};

module.exports.__module = {
    args: ['svc!routes/register','db/mongoDB'],
    provides: ['initializeApp']
}