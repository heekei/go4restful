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
function Info(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain;charset=utf-8'
    });
    var url = parse(req.url);
    var infoKey = url.pathname.split('/')[3]; //获取传入的字段名
    switch (req.method) {
        case 'GET':
            database('Info', req.method, {}, function (err, result) {
                var infoVal = infoKey ? result[0][infoKey] : result[0];
                var msg = new Msg(err || infoVal, !err && !!infoVal);
                console.log('result: ', result[0]);
                res.end(msg.toString());
            });
            break;
        default:
            req.on('data', function (data) {
                var hash = PublicMethod.resolveData(data.toString());
                // if (hash.id) hash.id = parseInt(hash.id);
                database('Info', req.method, hash, function (err, result) {
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
module.exports = Info;