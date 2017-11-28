const ServerResponse = require('http').ServerResponse,
    Msg = require('./class/APIResponseMessage');

/**
 * 输出404
 * 
 * @param {ServerResponse} response 
 */
function APINotFound(response) {
    response.writeHead(404, {
        'Content-Type': 'text/plain;charset=utf-8'
    });
    var msg = new Msg('未找到资源！', false);
    response.end(msg.toString());
}

/**
 * 输出403
 * 
 * @param {ServerResponse} response 
 * @param {String} message 自定义消息
 */
function forbidden(response, message) {
    response.writeHead(403, {
        'Content-Type': 'text/plain;charset=utf-8'
    });
    var msg = new Msg(message || '无权限进行操作', false);
    response.end(msg.toString());
}

/**
 * 输出400
 * 
 * @param {ServerResponse} response 
 * @param {String} message 自定义消息
 */
function badRequest(response, message) {
    response.writeHead(400, {
        'Content-Type': 'text/plain;charset=utf-8'
    });
    var msg = new Msg(message || '参数错误', false);
    response.end(msg.toString());
}

/**
 * 处理接收的数据,返回键值对
 * 
 * @param {String} data 
 * @returns 
 */
function resolveData(data) {
    var dataObj = {};
    var dataArray = data.split('&');
    dataArray.map(function (item) {
        var keyVal = item.split('=');
        dataObj[keyVal[0]] = keyVal[1];
    });
    return dataObj;
}
module.exports = {
    APINotFound: APINotFound,
    resolveData: resolveData,
    forbidden: forbidden,
    badRequest: badRequest
};