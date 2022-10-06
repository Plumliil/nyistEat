import {
	request
} from './request.js';

const signin = (options) => {
	return request({
		url: 'user/signin',
		method: 'POST',
		data: options
	})
}

const users = (options) => {
	return request({
		url: '/list',
		method: 'GET',
		data: options
	})
}

const updateUser = (options) => {
	return request({
		url: 'user/update',
		method: 'PUT',
		data: options
	})
}

const campusGetDish = (searchQuery) => {
	return request({
		url: `dish/get/${searchQuery.curCampus}?type=${searchQuery.type}&value=${searchQuery.value}&limit=${searchQuery.limit}&offset=${searchQuery.offset}`,
		method: 'GET',
	})
}

const getDish = (searchQuery) => {
	return request({
		url: `dish/get?type=${searchQuery.type}&value=${searchQuery.value}&limit=${searchQuery.limit}&offset=${searchQuery.offset}`,
		method: 'GET',
	})
}

const updateDish = (options) => {
	return request({
		url: 'dish/update',
		method: 'PUT',
		data: options
	})
}




module.exports = {
	users,
	signin,
	updateUser,
	campusGetDish,
	updateDish,
	getDish
}