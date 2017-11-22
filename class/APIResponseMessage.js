/**
 * API返回消息结构
 * 
 * @class APIResponseMessage
 * @constructor 
 * @method toString 返回JSON字符串
 */
class APIResponseMessage {
    constructor(data, isSuccess = true) {
        this.Success = isSuccess;
        this.Result = data;
        return this;

    }
    toString() {
        return decodeURI(JSON.stringify({
            Success: this.Success,
            Result: this.Result
        }));
    }
}
module.exports = APIResponseMessage;