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

function transClass(option) {
	let res = [];
	if (typeof option === 'object') {
		option.forEach(item => {
			switch (item) {
				case 'pasta"':
					res.push('面食')
					break;
				case 'rice':
					res.push('米饭')
					break;
				case 'cake':
					res.push('饼类')
					break;
				case 'porridge':
					res.push('粥类')
					break;
				case 'snack':
					res.push('小吃')
					break;
				case 'other':
					res.push('更多')
					break;
			}
		})
		return res

	} else {
		switch (option) {
			case 'pasta"':
				return '面食'
			case 'rice':
				return '米饭'
			case 'cake':
				return '饼类'
			case 'porridge':
				return '粥类'
			case 'snack':
				return '小吃'
			case 'other':
				return '更多'
		}
	}

}


module.exports = {
	transAddress,
	transClass
}