const Msg = require('../class/APIResponseMessage'),
    parse = require('url').parse,
    IncomingMessage = require('http').IncomingMessage,
    ServerResponse = require('http').ServerResponse,
    PublicMethod = require('../PublicMethod'),
    database = require('../database/database');

/**
 * 文章接口
 * 
 * @param {IncomingMessage} req 
 * @param {ServerResponse} res 
 */
function Article(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain;charset=utf-8'
    });
    var url = parse(req.url);
    if (url.query) var Pager = PublicMethod.resolveData(url.query);
    var id = parseInt(url.pathname.split('/')[3]); //获取传入的文章ID
    switch (req.method) {
        case 'GET':
            database('Article', req.method, parseInt(id) ? {
                id: parseInt(id)
            } : {}, function (err, result) {
                var msg = new Msg(err || result, !err);
                res.end(msg.toString());
            }, Pager);
            break;
        default:
            req.on('data', function (data) {
                var hash = PublicMethod.resolveData(data.toString());
                if (hash.id) hash.id = parseInt(hash.id);
                database('Article', req.method, hash, function (err, result) {
                    var msg;
                    if (err) {
                        msg = new Msg(err, false);
                    } else {
                        msg = new Msg(result.result.n, !!result.result.ok);
                    }
                    res.end(msg.toString());
                });
            });
            break;
    }



}
module.exports = Article;