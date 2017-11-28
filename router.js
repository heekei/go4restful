const parse = require('url').parse,
    fs = require('fs'),
    PATH = require('path'),
    config = require('./config'),
    RESTful = require('./RESTful');
var root = PATH.resolve(config.directory);
var handled = false;
/**
 * 
 * 
 * @param {IncomingMessage} req 
 * @param {ServerResponse} res 
 */
function router(req, res) {
    const url = parse(req.url);
    var pathname = decodeURI(url.pathname); //防止中文乱码
    // var rc = new RouterCtrl(req, res);
    // rc.get('/api', RESTful);
    // rc.redirect('/blog');
    if (pathname.indexOf('/api') === 0) { // 进入RESTful 
        RESTful(req, res);
    } else { // 静态资源

        //设置index.html为缺省页
        if (PATH.extname(pathname) === '') {
            pathname += '/index.html';
        }

        //将blog目录下的文件定向到root目录下
        if (pathname.indexOf('/blog') === 0) {
            pathname = pathname.substr(5, pathname.length - 4);
        }

        // 获得对应的本地文件路径，类似 '/srv/www/css/bootstrap.css':
        var filepath = PATH.join(root, pathname);

        // 获取文件状态:
        fs.stat(filepath, function (err, stats) {
            if (!err && stats.isFile()) {
                // 没有出错并且文件存在:
                console.log('200 ' + pathname);
                // 发送200响应:
                res.writeHead(200);
                // 将文件流导向res:
                fs.createReadStream(filepath).pipe(res);
            } else {
                // 出错了或者文件不存在:
                console.log('404: ' + pathname);
                // 发送404响应:
                res.writeHead(404);
                res.end('404 Not Found: ' + pathname);
            }
        });
    }
}



/**
 * 路由类
 * 
 * @class RouterCtrl
 */
class RouterCtrl {
    constructor(request, response) {
        this.request = request;
        this.response = response;
        this.url = parse(request.url);
        this.pathname = decodeURI(this.url.pathname);
    }
    /**
     * 路由规则
     * 
     * @param {String} RouterName 路由名称
     * @param {function(IncomingMessage, ServerResponse):void} callback 回调函数
     * @memberof RouterCtrl
     */
    get(RouterName, callback) {
        if (handled) return;
        if (this.pathname.indexOf(RouterName) === 0) {
            callback(this.request, this.response);
            handled = true;
            return;
        }
        defaultResponse(this);
    }
    redirect(fromPath, toPath) {
        if (handled) return;
        if (this.pathname.indexOf(fromPath) === 0) {
            this.pathname = this.pathname.substr(5, this.pathname.length - fromPath.length);
            defaultResponse(this);
        }
    }
}

/**
 * RouterCtrl的私有方法，执行路由默认规则
 * 
 * @param {Event} _this RouterCtrl实例的this
 */
function defaultResponse(_this) {
    if (handled) return;
    //设置index.html为缺省页
    if (PATH.extname(_this.pathname) === '') {
        _this.pathname += '/index.html';
    }

    //将blog目录下的文件定向到root目录下
    // if (_this.pathname.indexOf('/blog') === 0) {
    //     _this.pathname = _this.pathname.substr(5, _this.pathname.length - 4);
    // }

    // 获得对应的本地文件路径，类似 '/srv/www/css/bootstrap.css':
    var filepath = PATH.join(root, _this.pathname);

    // 获取文件状态:
    fs.stat(filepath, function (err, stats) {
        if (!err && stats.isFile()) {
            // 没有出错并且文件存在:
            console.log('200 ' + _this.pathname);
            // 发送200响应:
            _this.response.writeHead(200);
            // 将文件流导向res:
            fs.createReadStream(filepath).pipe(_this.response);
        } else {
            // 出错了或者文件不存在:
            console.log('404: ' + _this.pathname);
            // 发送404响应:
            _this.response.writeHead(404);
            _this.response.end('404 Not Found: ' + _this.pathname);
        }
    });
}

module.exports = router;