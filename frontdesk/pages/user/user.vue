<template>
	<view class="user">
		<uni-section title="个人资料" type="line">
			<uni-card :title="user.name" :isFull="true" :sub-title="'id:'+user._id" :extra="user.gender===0?'♂':'♀'"
				:thumbnail="avatar">
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
									<text>{{item.name}}</text>
									<text>{{item.price}}</text>
									<text>{{item.window}}</text>
								</view>
								<text class="deleteCollect" @tap="deleteLike(index)">x</text>
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
								<text class="deleteLike" @tap="deleteLike(index)">x</text>
							</li>
						</ul>
					</view>
				</uni-collapse-item>
			</uni-collapse>
			<uni-collapse>
				<uni-collapse-item title="随机记录" thumb="https://s2.loli.net/2022/09/22/5ScOPJLXfA1ez3i.png">
					<view class="content">
						<text class="text">折叠内容主体，可自定义内容及样式</text>
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
		updateUser
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
			this.user = this.userData.data
			console.log(this.userData);
		},
		methods: {
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
			},
			async deleteLike(curIndex) {
				console.log(1111);
				this.user.like = this.user.like.filter((item, index) => {
					return index !== curIndex
				})
				console.dir(this.user.like)
				console.dir(this.user._id)
				const {
					userUpdate
				} = await updateUser(this.user);
				this.userData.data = userUpdate;
				cache('NyistEatUser', this.userData)
				console.log(2222);
			}
		}
	}
</script>

<style scoped lang="scss">
	.user {
		height: 100vh;

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

					li {
						height: 40px;
						margin: 3px 0;
						line-height: 40px;
						border-bottom: 1px solid $uni-border-color;
						display: flex;
						justify-content: space-around;
						align-items: center;

						view {
							flex: 1;
						}

						.deleteLike {
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
