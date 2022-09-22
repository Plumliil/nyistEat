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

module.exports = {
	transAddress
}
