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

const register = (options) => {
	return request({
		url: 'user/register',
		method: 'POST',
		data: options
	})
}
const emailJSP = (options) => {
	return request({
		url: `user/jsp/${options}`,
		method: 'GET',
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
		method: 'POST',
		data: options
	})
}


const updateUserImg = (options) => {
	return request({
		url: 'upload/userImg',
		method: 'POST',
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

const updateDishImg = (options) => {
	return request({
		url: 'upload/dishImg',
		method: 'POST',
		data: options
	})
}






module.exports = {
	users,
	signin,
	register,
	emailJSP,
	updateUser,
	campusGetDish,
	updateDish,
	getDish,
	updateUserImg,
	updateDishImg
}
