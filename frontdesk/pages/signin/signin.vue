<template>
	<view class="signin">
		<uni-card class="unicard" padding="0" spacing="0">
			<view class="title">
				<img src="http://180.76.195.252:3366/public/other/wan.png" alt="">
				<text>把眼睛留给风光，把体重留给美食</text>
			</view>
			<view class="info">
				<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="text"
					activeColor="gray"></uni-segmented-control>
				<view class="content">
					<view class="signin" v-show="current === 0">
						<input type="text" v-model="signinData.value" placeholder="请输入邮箱/昵称">
						<input type="password" v-model="signinData.password" placeholder="请输入密码">
						<button class="signinBtn" @tap="signinUser">登录</button>
					</view>
					<view class="register" v-show="current === 1">
						<input type="text" :class="!namePass?'verifyName':''" v-model="registerData.name"
							@focus="validaKey('name')" @blur="validaKey('name')" placeholder="请输入用户名">
						<input type="text" :class="!emailPass?'verifyEmail':''" v-model="registerData.email"
							@focus="validaKey('email')" @blur="validaKey('email')" placeholder="请输入邮箱">
						<view class="jsp">
							<button @tap="emailJsp">获取验证码</button>
							<input type="text" v-model="registerData.userEmailCode" placeholder="验证码">
						</view>
						<input type="text" @focus="validaKey('password')" @blur="validaKey('password')"
							:class="!passwordPass?'verifyPassword':''" v-model="registerData.password"
							placeholder="请输入密码">
						<button class="registerBtn" @tap="registerUser">注册</button>
					</view>
				</view>
			</view>
		</uni-card>

	</view>
</template>
<script>
	import {
		cache
	} from '../../util/utils.js'
	import {
		signin,
		register,
		emailJSP
	} from '@/util/request/api.js'
	export default {
		data() {
			return {
				items: ['登录', '注册'],
				current: 0,
				registerData: {
					name: '',
					email: '',
					password: '',
					userEmailCode: ''
				},
				signinData: {
					value: '',
					password: ''
				},
				rdmEmailCode: 0,
				namePass: true,
				emailPass: true,
				passwordPass: true
			};
		},
		mounted() {
			let user = cache('NyistEstUser');
			if (user) {
				uni.switchTab({
					url: '/pages/index/index'
				})
			}

		},
		methods: {
			validaKey(type) {
				let nameReg = /.{3,20}/;
				let passwordReg = /[A-Za-z0-9.,@!_-]{6,12}/;
				let emailReg = /^([A-z0-9]{6,18})(\w|\-)+@[A-z0-9]+\.([A-z]{2,3})$/;
				switch (type) {
					case 'name':
						if (nameReg.test(this.registerData.name)) {
							this.namePass = true;
						} else {
							this.namePass = false;
						}
						break;
					case 'email':
						console.log(emailReg.test(this.registerData.email))
						if (emailReg.test(this.registerData.email)) {
							this.emailPass = true;
						} else {
							this.emailPass = false;
						}
						break;
					case 'password':
						if (passwordReg.test(this.registerData.password)) {
							this.passwordPass = true;
						} else {
							this.passwordPass = false;
						}
						break;
					default:
						break;
				}
			},
			onClickItem(e) {
				if (this.current != e.currentIndex) {
					this.current = e.currentIndex;
				}
			},
			async emailJsp() {
				console.log(this.registerData.email);
				if (!this.registerData.email) {
					uni.showToast({
						title: '邮箱错误',
						icon: 'error',
						duration: 2000,
					});
				} else {
					const emailJSPData = await emailJSP(this.registerData.email);
					this.rdmEmailCode = emailJSPData.rdmValue;
				}
			},
			async registerUser() {
				if (this.namePass && this.emailPass && this.passwordPass && this.registerData.email !== '') {
					if (this.rdmEmailCode === parseInt(this.registerData.userEmailCode)) {
						const registerData = await register(this.registerData)
						if (registerData.state === 'success') {
							this.current = 0;
							uni.showModal({
								title: '提示',
								content: '注册成功,请牢记注册信息!',
								showCancel: false,
								success() {
									this.signinData.value = this.registerData.name;
									this.registerData = {
										name: '',
										email: '',
										password: '',
										userEmailCode: ''
									};
								}
							})
						} else {
							console.log('出错');
							uni.showToast({
								title: registerData.error,
								duration: 1000
							})
						}
					}
				} else {
					uni.showToast({
						title: '输入信息错误',
						icon: 'error',
						duration: 1000
					})
				}
			},
			async signinUser() {
				const userData = await signin(this.signinData)
				cache('NyistEatUser', userData);
				if (userData.state === 'success') {
					uni.showToast({
						title: '登陆成功',
						duration: 1000,
						success() {
							setTimeout(()=>{
								uni.switchTab({
									url: '/pages/index/index'
								});
							},1000)
						}
					})
				}
			}
		}
	};
</script>

<style lang="scss" lang="scss">
	.signin {

		.title {
			width: 100%;
			display: flex;
			margin: 10px 0;
			justify-content: center;
			flex-direction: column;
			align-items: center;

			img {
				width: 100px;
				height: 100px;
				margin-top: 50px;
				// width: 100%;
			}

			text {
				display: block;
				font-size: 20px;
				margin-top: 20px;
			}
		}

		.unicard {
			height: 700px;
			margin-top: 20px;
		}

		.info {
			margin-top: 40px;
			height: 500px;

			.content {
				view {
					margin: 10px auto;
					height: 200px;
				}

				.signin {
					input {
						width: 300px;
						height: 50px;
						margin: 0 auto;
						font-size: 14px;
						border-bottom: 1px solid $uni-border-color;
					}

					.signinBtn {
						width: 70px;
						height: 36px;
						font-size: 16px;
						line-height: 36px;
						background: black;
						margin-top: 30px;
						color: rgb(255, 255, 255);

					}
				}

				.register {
					position: relative;

					.jsp {
						// background-color: aqua;
						width: 300px;
						height: 50px;
						display: flex;
						justify-content: space-around;
						align-items: center;

						button {
							width: 120px;
							height: 40px;
							font-size: 15px;
							padding: 0;
							line-height: 40px;
							background: none;
						}

						input {
							font-size: 20px;
							text-indent: 70px;
							width: 200px;
							height: 40px;
						}
					}

					input {
						// position: relative;
						width: 300px;
						height: 50px;
						margin: 0 auto;
						font-size: 14px;
						border-bottom: 1px solid $uni-border-color;

					}

					.verifyName {
						position: relative;
						border-bottom: 1px solid red;

						&::after {
							content: '昵称不小于三个字符';
							position: absolute;
							right: 0;
							top: 30%;
							color: red;


						}
					}

					.verifyEmail {
						position: relative;
						border-bottom: 1px solid red;

						&::after {
							content: '请输入正确用邮箱';
							position: absolute;
							right: 0%;
							top: 30%;
							color: red;


						}
					}

					.verifyPassword {
						position: relative;
						border-bottom: 1px solid red;

						&::after {
							content: '密码长度6-12';
							position: absolute;
							right: 0%;
							top: 30%;
							color: red;


						}
					}

					.registerBtn {
						width: 70px;
						height: 36px;
						font-size: 16px;
						line-height: 36px;
						background: black;
						margin-top: 30px;
						color: rgb(255, 255, 255);

					}

				}
			}
		}


	}
</style>
