const parse = require('url').parse,
    IncomingMessage = require('http').IncomingMessage,
    ServerResponse = require('http').ServerResponse,
    common = require('./common');
/**
 * RESTful
 * 
 * @param {IncomingMessage} req 
 * @param {ServerResponse} res 
 * @param {Url} url 
 */
function RESTful(req, res) {
    const url = parse(req.url, true);
    var pathname = url.pathname;
    var resource = pathname.split('/')[2];

    if (resource) {
        try {
            const resourceModule = require('./module/' + resource);
            resourceModule(req, res);
        } catch (error) {
            console.log(error);
            common.APINotFound(res);
        }
    } else {
        // var msg = new Msg('未找到资源！', false);
        // res.end(msg.toJSONString());
        common.APINotFound(res);
    }
}
module.exports = RESTful;