<template>
	<view class="signin">
		<uni-card class="unicard" padding="0" spacing="0">
			<view class="title">
				<img src="https://s2.loli.net/2022/09/22/6DrCu2JEemBPOak.png" alt="" @tap="signin">
				<text>NyistEat</text>
			</view>
			<view class="info">
				<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="text"
					activeColor="gray"></uni-segmented-control>
				<view class="content">
					<view class="signin" v-show="current === 0">
						<input type="text" v-model="signinData.email" placeholder="请输入邮箱">
						<input type="password" v-model="signinData.password" placeholder="请输入密码">
						<button class="signinBtn" @tap="signinUser">登录</button>
					</view>
					<view class="register" v-show="current === 1">
						<input type="text" v-model="registerData.name" placeholder="请输入用户名">
						<input type="text" v-model="registerData.email" placeholder="请输入邮箱">
						<view class="jsp">
							<button @tap="emailJsp">获取验证码</button>
							<input type="text" v-model="registerData.userEmailCode" placeholder="验证码">
						</view>
						<input type="text" v-model="registerData.password" placeholder="请输入密码">
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
		signin
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
					email: '',
					password: ''
				},
				rdmEmailCode: 0,
				// userEmailCode:''
			};
		},
		mounted() {
			let user = cache('NyistEstUser');
			if (user) {
				console.log(111);
				uni.switchTab({
					url: '/pages/index/index'
				})
			}

		},
		methods: {

			onClickItem(e) {
				if (this.current != e.currentIndex) {
					this.current = e.currentIndex;
				}
			},
			emailJsp() {
				console.log(this.registerData.email);
				if (!this.registerData.email) {
					uni.showToast({
						title: '邮箱错误',
						icon: 'error',
						duration: 2000,
					});
				} else {
					uni.request({
						// url: `http://localhost:3366/api/user/jsp/${this.registerData.email}`,
						url: `http://180.76.195.252:3366/api/user/jsp/${this.registerData.email}`,
						method: 'GET',
						success: (res) => {
							this.rdmEmailCode = res.data.rdmValue;
							console.log(res);
						},
						fail: (err) => {
							console.log(err);
						}
					})
				}
			},
			registerUser() {
				if (this.rdmEmailCode === parseInt(this.registerData.userEmailCode)) {
					uni.request({
						// url: 'http://localhost:3366/api/user/register',
						url: 'http://180.76.195.252:3366/api/user/register',
						method: 'POST',
						data: this.registerData,
						success: (res) => {
							console.log(res.data.state);
							uni.navigateTo({
								url: '/pages/index/index'
							})
						},
						fail: (err) => {
							console.log(err);
							console.log('error');
						}
					})
				}
			},
			async signinUser() {
				const userData = await signin(this.signinData)
				cache('NyistEatUser', userData);
				if (userData.state === 'success') {
					uni.navigateTo({
						url: '/pages/user/user'
					})
				}
				this.$forceUpdate();
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
				width: 70px;
				height: 70px;
			}

			text {
				display: block;
				font-size: 20px;
				margin-top: 20px;
			}
		}

		.unicard {
			height: 500px;
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
						margin-top: 12px;
						color: rgb(255, 255, 255);

					}
				}

				.register {
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
						width: 300px;
						height: 50px;
						margin: 0 auto;
						font-size: 14px;
						border-bottom: 1px solid $uni-border-color;
					}

					.registerBtn {
						width: 70px;
						height: 36px;
						font-size: 16px;
						line-height: 36px;
						background: black;
						margin-top: 12px;
						color: rgb(255, 255, 255);

					}

				}
			}
		}
	}
</style>
