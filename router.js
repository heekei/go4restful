const parse = require('url').parse,
    fs = require('fs'),
    path = require('path'),
    config = require('./config');
var root = path.resolve(config.director);

function router(req, res) {
    const url = parse(req.url);
    var pathname = decodeURI(url.pathname); //防止中文乱码
    if (path.extname(pathname) === '') { //设置index.html为缺省页
        pathname += '/index.html';
    }
    if (pathname.indexOf('/blog') === 0) { //将blog目录下的文件定向到root目录下
        pathname = pathname.substr(5, pathname.length - 4);
    }
    if (pathname.indexOf('/api') === 0) { // 进入RESTful 
        res.writeHead(200, {
            'Content-Type': 'text/plain;charset=utf-8'
        });
        res.end('进入RESTful');
    } else { // 前端
        // 获得对应的本地文件路径，类似 '/srv/www/css/bootstrap.css':
        var filepath = path.join(root, pathname);
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
module.exports = router;