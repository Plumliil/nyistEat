const crypto = require('crypto')

// 获取crypto支持的散列算法
// console.log(crypto.getHashes())

function encryption(value) {
    return crypto.createHash('md5')
        .update('nyist' + value)
        .digest('hex');
}

module.exports={
    encryption
}