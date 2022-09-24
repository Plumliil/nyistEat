function transAddress(addressArray) {
	let res = [];
	addressArray.forEach(item => {
		switch (item) {
			case 'eastCampus':
				res.push('东校区')
				break;
			case 'headOfTheSouth':
				res.push('南苑')
				break;
			case 'headOfTheWest':
				res.push('西苑')
				break;
			case 'minzu':
				res.push('民族餐厅')
				break;
			case 'fengwei':
				res.push('风味餐厅')
				break;
			case 'zhuyao':
				res.push('南苑餐厅')
				break;
			case 'firstFloor':
				res.push('一楼')
				break;
			case 'secondFloor':
				res.push('二楼')
				break;
		}
	})
	return res
}
function cache(key, value, time = 3600*3600*3600*3600) {
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
module.exports = {
	transAddress,
	cache
}
