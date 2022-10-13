<template>
	<view class="user">
		<uni-section title="个人资料" type="line">
			<uni-card @click="signin" :title="user.name" :isFull="true" :sub-title="'Email:'+user.email"
				:extra="user.gender===0?'♂':'♀'" :thumbnail="avatar" @tap="showpopUp">
			</uni-card>
		</uni-section>
		<uni-section class="functionList" title="功能列表" type="line">
			<uni-collapse>
				<uni-collapse-item title="我的收藏" thumb="../../static/img/tools/collect.png">
					<view class="content">
						<ul>
							<li v-for="(item,index) in user.collect">
								<view class="">
									<text>{{index+1+'.'}}</text>
									<text style="margin-left: 20px;">{{item.name}}</text>
									<text style="margin-left: 20px;">{{item.price}}</text>
									<text>{{item.window}}</text>
								</view>
								<text class="deleteLikeAndCollect"
									@tap="deleteLikeAndCollect(item,index,'collect')">x</text>
							</li>
						</ul>
					</view>
				</uni-collapse-item>
			</uni-collapse>
			<uni-collapse>
				<uni-collapse-item title="我的点赞" thumb="../../static/img/tools/like.png">
					<view class="content">
						<ul>
							<li v-for="(item,index) in user.like">
								<view class="">
									<text>{{index+1+'.'}}</text>
									<text>{{item.name}}</text>
									<text>{{item.price}}</text>
									<text>{{item.window}}</text>
								</view>
								<text class="deleteLikeAndCollect"
									@tap="deleteLikeAndCollect(item,index,'like')">x</text>
							</li>
						</ul>
					</view>
				</uni-collapse-item>
			</uni-collapse>
			<uni-collapse>
				<uni-collapse-item title="随机记录" thumb="../../static/img/tools/history.png">
					<view class="content">
						<ul>
							<li v-for="(item,index) in user.rdmHistory">
								<view class="">
									<text>{{index+1+'.'}}</text>
									<text>{{item.name+'------'}}</text>
									<text>{{item.window}}</text>
									<text class="time">{{item.time}}</text>
								</view>
								<text class="deleteLikeAndCollect" @tap="deleteHistory(item,index)">x</text>
							</li>
						</ul>
					</view>
				</uni-collapse-item>
			</uni-collapse>
			<uni-collapse>
				<uni-collapse-item title="问题反馈" thumb="../../static/img/tools/question.png">
					<view class="content" style="height: 50px;">
						<text class="intro">请将问题发至邮箱plumliil@189.cn</text>
					</view>
				</uni-collapse-item>
			</uni-collapse>
			<uni-collapse>
				<uni-collapse-item title="关于软件" thumb="../../static/img/tools/about.png">
					<view class="content" style="height: 50px;">
						<text class="intro">本软件致力于解决选择困难...</text>
					</view>
				</uni-collapse-item>
			</uni-collapse>
		</uni-section>
		<!-- <img src="../../" alt=""> -->
		<!-- 普通弹窗 -->
		<uni-popup class="popup" ref="popup" background-color="#fff">
			<view class="popup-content">
				<text @tap="changeImg">选择头像</text>
				<text @tap="changeSex">更改性别</text>
				<text @tap="logout">退出登录</text>
			</view>
			<view v-if="isShowImg" class="popup-image">
				<img v-for="item in baseUserImgs" :src="item.value" alt="" @tap="imgChange(item.value)">
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		cache
	} from '@/util/utils.js';
	import {
		updateUser,
		updateDish,
		updateUserImg,
		updateDishImg
	} from '@/util/request/api.js'
	import kspCropper from "@/components/ksp-cropper/components/ksp-cropper/ksp-cropper.vue"
	export default {
		components: {
			kspCropper
		},
		data() {
			return {
				extraIcon: {
					color: '#4cd964',
					size: '22',
					type: 'gear-filled'
				},
				userData: {},
				user: {},
				subData: {
					type: '',
					value: ''
				},
				baseUserImgs: [{
						// example: '../../static/img/user/b_0_1.png',
						value: 'http://180.76.195.252:3366/public/userImgs/b_0_1.png'
					},
					{
						// example: '../../static/img/user/g_0_1.png',
						value: 'http://180.76.195.252:3366/public/userImgs/g_0_1.png'
					}, {
						// example: '../../static/img/user/b_0_2.png',
						value: 'http://180.76.195.252:3366/public/userImgs/b_0_2.png'
					}, {
						// example: '../../static/img/user/g_0_2.png',
						value: 'http://180.76.195.252:3366/public/userImgs/g_0_2.png'
					}, {
						// example: '../../static/img/user/b_1_1.png',
						value: 'http://180.76.195.252:3366/public/userImgs/b_1_1.png'
					}, {
						// example: '../../static/img/user/g_1_1.png',
						value: 'http://180.76.195.252:3366/public/userImgs/g_1_1.png'
					},
					{
						// example: '../../static/img/user/b_1_2.png',
						value: 'http://180.76.195.252:3366/public/userImgs/b_1_2.png'
					}, {
						// example: '../../static/img/user/g_1_2.png',
						value: 'http://180.76.195.252:3366/public/userImgs/g_1_2.png'
					},
				],
				isShowImg: false
			}
		},
		onLoad() {
			this.userData = cache('NyistEatUser');
			if (this.userData) {
				this.user = this.userData.data
			}
			this.avatar = this.userData.data.image
		},
		onShow() {
			this.userData = cache('NyistEatUser');
			if (this.userData) {
				this.user = this.userData.data
			}
		},
		onReachBottom() {
		},
		methods: {
			showpopUp() {
				this.$refs.popup.open('center')
			},
			changeImg() {
				this.isShowImg = true
			},
			async imgChange(item) {
				const updateUserState = await updateUser({
					_id: this.user._id,
					image: item
				});
				this.userData.data = updateUserState.userUpdate;
				cache('NyistEatUser', this.userData);
				this.avatar = item;
				this.$forceUpdate();
			},
			async changeSex() {
				this.subData.value = this.user.gender;
				if (this.subData.value === 0) {
					this.subData.value = 1;
				} else {
					this.subData.value = 0;
				}
				this.subData.type = 'gender';
				const updateUserState = await updateUser({
					_id: this.user._id,
					gender: this.subData.value
				});
				this.userData.data = updateUserState.userUpdate;
				cache('NyistEatUser', this.userData);
				this.$refs.popup.close();


			},
			logout() {
				const that=this;
				uni.showModal({
					title: '提示',
					content: '不在看看了吗',
					success: function(res) {
						if (res.confirm) {
							that.$refs.popup.close();
							uni.removeStorage({
								key: 'NyistEatUser',
								success() {
									uni.showToast({
										title: '退出成功!',
										duration: 1000
									});
									setTimeout(() => {
										uni.redirectTo({
											url: '/pages/signin/signin'
										})
									}, 1100)
								}
							});
						} else if (res.cancel) {
						}
					}
				});
			},
			signin() {
				let checkUser = cache('NyistEatUser');
				if (!checkUser) {
					uni.navigateTo({
						url: '/pages/signin/signin'
					})
				}

			},
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
			},
			async deleteLikeAndCollect(curItem, curIndex, type) {
				this.user[type] = this.user[type].filter((item, index) => index !== curIndex)
				curItem[type] = curItem[type].filter(item => item._id !== this.user._id);
				const updateUserState = await updateUser({
					_id: this.user._id,
					[type]: this.user[type],
				});
				const updateDishState = await updateDish({
					_id: curItem._id,
					[type]: curItem[type]
				});
				this.userData.data = this.user;
				cache('NyistEatUser', this.userData)
			},
			async deleteHistory(curItem, curIndex) {
				this.user.rdmHistory.forEach((item, index) => {
					if (index === curIndex) {
						this.user.rdmHistory.splice(index, 1)
					}
				});
				const updateUserState = await updateUser({
					_id: this.user._id,
					rdmHistory: this.user.rdmHistory
				});
				this.userData.data = this.user;
				cache('NyistEatUser', this.userData);
			},

		}
	}
</script>

<style scoped lang="scss">
	.user {
		height: 92vh;

		.card-actions {
			display: flex;
			justify-content: space-around;
			align-items: center;
		}

		.popup {
			.popup-content {
				width: 300px;
				display: flex;
				justify-content: space-around;
				align-items: center;
				padding: 5px;

				text {
					padding: 5px;
					border-radius: 3px;
					font-size: 14px;
					font-weight: 500;
				}
			}

			.popup-image {
				width: 300px;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-around;
				align-items: center;
				padding: 5px;

				img {
					width: 50px;
					height: 50px;
					padding: 10px;
				}
			}
		}

		.functionList {
			.content {
				width: 98%;
				height: 200px;
				overflow-y: scroll;
				margin: 0 auto;

				.intro {
					display: block;
					height: 30px;
					font-size: 12px;
					line-height: 30px;
					text-align: center;
				}

				ul {
					list-style-type: decimal;
					margin: 0;

					li {
						height: 40px;
						margin: 3px 0;
						line-height: 40px;
						border-bottom: 1px solid $uni-border-color;
						display: flex;
						justify-content: space-around;
						align-items: center;

						view {
							position: relative;
							flex: 1;

							text {
								margin: 0 3px;
							}

							.time {
								position: absolute;
								bottom: 0px;
								right: 0;
								font-size: 5px;
								color: $text-color-annotation;
							}
						}

						.deleteLikeAndCollect {
							width: 30px;
							text-align: center;
							margin-right: 30px;
							// background-color: aqua;
						}
					}
				}
			}
		}
	}
</style>
