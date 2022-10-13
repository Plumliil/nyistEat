const url_all = {
	// 'DEV': 'http://localhost:3366/api/', // 开发
	'DEV': 'http://180.76.195.252:3366/api/', // 生产
}
let BASEURL = url_all['DEV']
// 发起请求
function handleRequest(options, resolve, reject) {
	uni.request({
		url: BASEURL + options.url,
		method: options.method,
		data: options.data,
		success: (response) => {
			return resolve(response.data)
		},
		fail: (fail) => {
			console.log('fail', fail)
			return reject(fail);
		}
	})
}

export const request = (options = {}) => {
	return new Promise((resolve, rejects) => {
		handleRequest(options, resolve, rejects)
	})
}












