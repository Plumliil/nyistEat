function cache(key, value, time = 3600 * 24 * 24 * 24) {
	let nowTime = Date.parse(new Date()) / 1000;
	if (key && value) {
		// 设置到期时间
		let expire = nowTime + Number(time);
		uni.setStorageSync(key, JSON.stringify(value) + '|' + expire);
		console.log('已经把' + key + '存入缓存,过期时间是' + expire);

	} else if (key && !value) {
		let val = uni.getStorageSync(key);
		if (val) {
			// 判断缓存是否过期
			let temp = val.split('|');
			if (!temp[1] || temp[1] <= nowTime) {
				uni.removeStorageSync(key);
				console.log(key + '缓存已失效');
				return '';
			} else {
				return JSON.parse(temp[0]);
			}
		}
	}
}

// 首先，定义一个方法，在方法内接收四个参数，一个参数是接收间隔的天数，第二个参数是接收具体某个时间点，第三个参数是决定是否在启动服务时立即执行一次，第四个参数是一个执行的方法，即要定时执行的逻辑。当然，这前三个参数将定义在一个对象中，实际传入一个对象和一个函数作为参数就可以，这样整个对象可以作为配置参数。
// 
/* 
	config:{
		interval:1, 间隔天数
		runNow:Boolean, 是否立即运行
		time:String, 执行的时间点 "14:00:00"
	},
	func:Function 执行的回调
*/
function timeoutFunc(config, func) {
	config.runNow && func()
	let nowTime = new Date().getTime()
	let timePoints = config.time.split(':').map(i => parseInt(i))
	let recent = new Date().setHours(...timePoints)
	recent >= nowTime || (recent += 24 * 3600000)
	setTimeout(() => {
		func()
		setInterval(func, config.interval * 3600000)
	}, recent - nowTime)
}

module.exports = {
	cache,
	timeoutFunc
}
