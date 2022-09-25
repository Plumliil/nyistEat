<template>
	<view class="user">
		<uni-section title="个人资料" type="line">
			<uni-card @click="signin" :title="user.name" :isFull="true" :sub-title="'Email:'+user.email"
				:extra="user.gender===0?'♂':'♀'" :thumbnail="avatar">
			</uni-card>
		</uni-section>
		<uni-section class="functionList" title="功能列表" type="line">
			<uni-collapse>
				<uni-collapse-item title="我的收藏" thumb="https://s2.loli.net/2022/09/22/bLxo56YGOqfN3K7.png">
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
				<uni-collapse-item title="我的点赞" thumb="https://s2.loli.net/2022/09/22/qPs5wA4bmzr8Mng.png">
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
				<uni-collapse-item title="随机记录" thumb="https://s2.loli.net/2022/09/22/5ScOPJLXfA1ez3i.png">
					<view class="content">
						<ul>
							<li v-for="(item,index) in user.rdmHistory">
								<view class="">
									<text>{{index+1+'.'}}</text>
									<text>{{item.name+'------'}}</text>
									<!-- <text>{{item.price}}</text> -->
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
				<uni-collapse-item title="问题反馈" thumb="https://s2.loli.net/2022/09/22/OfIrAFywz9RbTeU.png">
					<view class="content">
						<text class="text">折叠内容主体，可自定义内容及样式</text>
					</view>
				</uni-collapse-item>
			</uni-collapse>
			<uni-collapse>
				<uni-collapse-item title="关于软件" thumb="https://s2.loli.net/2022/09/22/PjkeL7izrBhGyqJ.png">
					<view class="content">
						<text class="text">折叠内容主体，可自定义内容及样式</text>
					</view>
				</uni-collapse-item>
			</uni-collapse>
		</uni-section>
	</view>
</template>

<script>
	import {
		cache
	} from '@/util/utils.js';
	import {
		updateUser,
		updateDish
	} from '@/util/request/api.js'
	export default {
		data() {
			return {
				avatar: '../../static/img/userM.png',
				extraIcon: {
					color: '#4cd964',
					size: '22',
					type: 'gear-filled'
				},
				userData: {},
				user: {}
			}
		},
		onLoad() {
			this.userData = cache('NyistEatUser');
			if (this.userData) {
				this.user = this.userData.data
			}
		},
		onShow() {
			this.userData = cache('NyistEatUser');
			if (this.userData) {
				this.user = this.userData.data
			}
			console.log(this.user);
		},
		methods: {
			signin() {
				let checkUser = cache('NyistEatUser');
				console.log(checkUser);
				if (!checkUser) {
					uni.navigateTo({
						url: '/pages/signin/signin'
					})
				}

				console.log(1111);
			},
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
			},
			async deleteLikeAndCollect(curItem, curIndex, type) {
				this.user[type] = this.user[type].filter((item, index) => index !== curIndex)
				curItem[type] = curItem[type].filter(item => item._id !== this.user._id);
				const updateUserState = await updateUser(this.user);
				const updateDishState = await updateDish({
					_id: curItem._id,
					[type]: curItem[type]
				});
				this.userData.data = this.user;
				cache('NyistEatUser', this.userData)
				// location.reload()
			},
			async deleteHistory(curItem, curIndex) {
				console.log('curItem', curItem);
				console.log('curIndex', curIndex);
				console.log(this.user.rdmHistory.length);
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
				console.log(this.user.rdmHistory.length);
			}
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

		.functionList {
			.content {
				width: 98%;
				height: 200px;
				overflow-y: scroll;
				margin: 0 auto;

				ul {
					// background-color: antiquewhite;
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
							.time{
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
