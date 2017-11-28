const parse = require('url').parse,
    IncomingMessage = require('http').IncomingMessage,
    ServerResponse = require('http').ServerResponse,
    PublicMethod = require('./PublicMethod');
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
            PublicMethod.badRequest(res, error);
        }
    } else {
        PublicMethod.APINotFound(res);
    }
}
module.exports = RESTful;