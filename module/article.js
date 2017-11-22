const Msg = require('../class/APIResponseMessage'),
    parse = require('url').parse,
    IncomingMessage = require('http').IncomingMessage,
    ServerResponse = require('http').ServerResponse,
    common = require('../common'),
    database = require('../database/database');

/**
 * 文章接口
 * 
 * @param {IncomingMessage} req 
 * @param {ServerResponse} res 
 */
function article(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain;charset=utf-8'
    });
    var url = parse(req.url);
    var id = parseInt(url.pathname.split('/')[3]);
    switch (req.method) {
        case 'GET':
            database('article', req.method, parseInt(id) ? {
                id: parseInt(id)
            } : {}, function (err, result) {
                var msg;
                if (err) {
                    msg = new Msg(err, false);
                } else {
                    msg = new Msg(result, true);
                }
                res.end(msg.toString());
            });
            break;
        default:
            req.on('data', function (data) {
                var hash = common.resolveData(data.toString());
                if (hash.id) hash.id = parseInt(hash.id);
                database('article', req.method, hash, function (err, result) {
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
module.exports = article;