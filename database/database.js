var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/local'; // 数据库为 runoob
var Promise = require('promise');
/**
 * 自增索引
 * 
 * @param {any} db 数据库
 * @param {any} table 表名
 * @returns {Promise}
 */
function getNextSequenceValue(db, table) {
    var collection = db.collection('counters'); //选择
    var defer = collection.findAndModify({
        _id: table //查找 _id 与表名相同的数据
    }, [], {
        $inc: {
            sequence_value: 1 //sequence_value自增1
        }
    }, {
        upsert: true, //不存在则新建
        new: true //返回更新后的值
    });
    return defer;
}

/**
 * 插入数据
 * 
 * @param {any} db 数据库
 * @param {any} table 表名
 * @param {any} data 数据
 * @param {any} callback 回调
 */
function insertData(db, table, data, callback) {
    var collection = db.collection(table);
    getNextSequenceValue(db, table).then(function (result) {
        data.id = result.value.sequence_value;
        data.crtime = new Date().valueOf();
        collection.insert(data, function (err, result) {
            db.close();
            // if (err) {
            //     callback(err);
            //     return;
            // }
            callback(err, result);
        });
    });
};

/**
 * 查询数据
 * 
 * @param {any} db 数据库
 * @param {any} table 表名
 * @param {any} data 参数
 * @param {any} callback 回调
 */
function queryData(db, table, data, callback, queryHash) {
    var collection = db.collection(table);
    var countPromise = new Promise(function (resolve, reject) {
        collection.count(function (err, data) {
            console.log('data: ', data);
            resolve(data);
        });
    });

    var dbRes = collection.find(data, {
        '_id': 0
    }).sort({
        id: -1
    });
    if (queryHash) dbRes.limit(+queryHash.pagesize).skip(((+queryHash.page) - 1) * (+queryHash.pagesize));
    dbRes.toArray(function (err, result) {
        db.close();
        countPromise.then(function (cData) {
            if (queryHash) {
                result = {
                    pager: {
                        page: +queryHash.page,
                        pagesize: +queryHash.pagesize,
                        total_count: cData,
                        count: result.length,
                        pagecount: Math.ceil(cData / +queryHash.pagesize)
                    },
                    data: result
                };
            }
            callback(err, result);
        });
    });
}


/**
 * 删除数据
 * 
 * @param {any} db 数据库
 * @param {any} table 表名
 * @param {any} data 参数
 * @param {any} callback 回调
 */
function deleteData(db, table, data, callback) {
    var collection = db.collection(table);
    collection.remove(data, function (err, result) {
        db.close();
        // if (err) {
        //     callback(err);
        //     return;
        // }
        callback(err, result);
    });
}
/**
 * 更新数据
 * 
 * @param {any} db 数据库
 * @param {any} table 表名
 * @param {any} data 参数
 * @param {any} callback 回调
 */
function updateData(db, table, data, callback) {
    var collection = db.collection(table);
    var whereStr = {};
    if (data.id) whereStr.id = data.id;
    delete data.id; //删除参数中的id
    data.lastmodify = new Date().valueOf();
    var updateStr = {
        $set: data
    };
    collection.update(whereStr, updateStr, function (err, result) {
        db.close();
        // if (err) {
        //     callback(err);
        //     return;
        // }
        callback(err, result);
    });
}

/**
 * 操作数据库
 * 
 * @param {String} table 表名
 * @param {String} method 方法
 * @param {{}} data 参数/数据
 * @param {Function} callback 回调
 */
function OperationDatabase(table, method, data, callback, options) {
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        switch (method) {
            case 'GET':
                queryData(db, table, data, callback, options);
                break;
            case 'PUT':
                insertData(db, table, data, callback);
                break;
            case 'POST':
                updateData(db, table, data, callback);
                break;
            case 'DELETE':
                deleteData(db, table, data, callback);
                break;
        }
    });
}
module.exports = OperationDatabase;