<template>
	<view class="index">
		<view class="header">
			<view class="tab">
				<text v-for="(item,index) in campus" :class="curCampusIndex===index?'campusActive':''"
					@tap="changeCampus(item,index)">{{item.label}}</text>
				<text class="poem">人生苦短 再来一碗...</text>
			</view>
		</view>
		<view class="classification">
			<text :class="curClassification===index?'classificationActive':''" v-for="(item,index) in classification"
				:ref="'classificationRef'+index" @tap.stop="changeClass(item,index)">
				{{item.label}}
			</text>
		</view>
		<ul class="dishList">
			<li v-for="(item,index) in dishData" :key="index" @tap="dishDetail(item)">
				<text class="window">{{item.window}}</text>
				<view class="name_price">
					<text>{{item.name}}</text>
					<text class="price"><text>定价: </text>{{item.price}}</text>
				</view>
				<text class="time">更新日期: {{item.updatedAt.substring(0,10)}}</text>
			</li>
		</ul>
		<!-- 普通弹窗 -->
		<uni-popup class="popup" ref="popup" background-color="#fff">
			<view class="popup-content">
				<text class="title">{{curDish.name}}</text>
				<view class="detail">
					<img :src="curDish.image" alt="">
					<view class="text">
						<text class="window">{{curDish.window}}</text>
						<text class="address">{{curDish.address}}</text>
					</view>
				</view>
				<view class="expand">
					<view ref="likeRef" @tap="like" :class="isLike?'likeCollectActive':''">
						<uni-icons type="hand-up" size="20" :color="isLike?'red':''"></uni-icons>:点赞
					</view>
					<view ref="collectRef" @tap="collect" :class="isCollect?'likeCollectActive':''">
						<uni-icons type="plusempty" size="20" :color="isCollect?'red':''"></uni-icons>:收藏
					</view>
					<view class="" ref="scoreRef">
						<uni-icons type="starhalf" size="20" :color="isScore?'scoreActive':''"></uni-icons>:
						<uni-rate allow-half :size="20" :value="rateValue" @change="scoreChange" />
					</view>
				</view>
			</view>
		</uni-popup>

	</view>
</template>

<script>
	import {
		transAddress,
		cache
	} from '../../util/utils.js'
	import {
		campusGetDish,
		updateDish,
		updateUser
	} from '../../util/request/api.js'
	export default {
		data() {
			return {
				isLoading: true,
				campus: [{
						label: '南苑',
						value: 'headOfTheSouth'
					},
					{
						label: '西苑',
						value: 'headOfTheWest'
					},
					// {
					// 	label: '东校区',
					// 	value: 'eastCampus'
					// },
				],
				curCampusIndex: 0,
				curClassification: -1,
				isCurClassification: true,
				classification: [{
						label: '米饭',
						value: 'rice'
					},
					{
						label: '面食',
						value: 'pasta'
					},
					{
						label: '小吃',
						value: 'snack'
					}, {
						label: '粥类',
						value: 'porridge'
					}, {
						label: '饼类',
						value: 'cake'
					}, {
						label: '更多',
						value: 'other'
					},
				],
				searchQuery: {
					curCampus: 'headOfTheSouth',
					type: "",
					value: null,
					limit: 10,
					offset: 0,
				},
				index: 0,
				dishData: [],
				rateValue: 3.5,
				curDish: {},
				userData: {},
				user: {},
				isLike: false,
				isCollect: false,
				isScore: false
			}

		},
		onLoad() {
			this.getData({
				curCampus: 'headOfTheSouth',
				type: "",
				value: null,
				limit: 10,
				offset: 0,
			})
			this.userData = cache('NyistEatUser');
			this.user = this.userData.data;
		},
		onShow() {
			this.getData(this.searchQuery)
			this.userData = cache('NyistEatUser');
			this.user = this.userData.data;
		},
		onPullDownRefresh() {
			this.getData({
				curCampus: 'headOfTheSouth',

			})
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onReachBottom() {
		},
		methods: {
			async getData(options) {
				const dishList = await campusGetDish(options);
				this.dishData = dishList.list;
			},
			checkLikeAndCollect() {
				this.isLike = this.curDish.like.some(item => {
					return item._id === this.user._id
				})
				this.isCollect = this.curDish.collect.some(item => {
					return item._id === this.user._id
				})
				this.isScore = this.curDish.score.some(item => {
					return item._id === this.user._id
				})
			},
			dishDetail(item) {
				this.curDish = item;
				this.checkLikeAndCollect();
				if (typeof this.curDish.address === 'object') {
					this.curDish.address = transAddress(this.curDish.address).join('-');
				}
				this.rateValue = this.curDish.score[0]
				this.$refs.popup.open('center')
			},
			async likeAndCollect(type) {
				let dishHasUser = this.curDish[type].some(item => item._id === this.user._id)
				let userHasDish = this.user[type].some(item => item._id === this.curDish._id)
				if (dishHasUser && userHasDish) {
					this.user[type] = this.user[type].filter(item => {
						return item._id !== this.curDish._id;
					})
					this.curDish[type] = this.curDish[type].filter(item => {
						return item._id !== this.user._id;
					})
					// 菜品和用户更新[type]
					const updateDishState = await updateDish({
						_id: this.curDish._id,
						[type]: this.curDish[type]
					});
					this.userData.data = this.user;
					cache('NyistEatUser', this.userData);
					const updateUserState = await updateUser(this.user);
					this.getData(this.searchQuery);
				} else {
					this.user[type].push(this.curDish);
					this.curDish[type].push({
						_id: this.user._id,
						gender: this.user.gender
					});
					// 菜品和用户更新[type]
					const updateDishState = await updateDish({
						_id: this.curDish._id,
						[type]: this.curDish[type]
					});
					this.userData.data = this.user;
					cache('NyistEatUser', this.userData);
					const updateUserState = await updateUser(this.user);
					this.getData(this.searchQuery);
				}
				this.$forceUpdate();
			},
			like() {
				uni.showToast({
					title: '操作成功(‾◡◝)',
					duration: 800
				})
				this.likeAndCollect('like')
				this.checkLikeAndCollect();
			},
			collect() {
				uni.showToast({
					title: '操作成功(‾◡◝)',
					duration: 800
				})
				this.likeAndCollect('collect');
				this.checkLikeAndCollect();
			},
			async scoreChange(e) {
				this.checkLikeAndCollect();
				if (!this.isScore) {
					this.curDish.score.push({
						_id: this.user._id,
						value: e.value
					});
					const scoreUpdate = await updateDish({
						_id: this.curDish._id,
						score: this.curDish.score
					})
				} else {
					this.curDish.score.forEach(item => {
						if (item._id === this.user._id) {
							item.value = e.value;
						}
					})
					const scoreUpdate = await updateDish({
						_id: this.curDish._id,
						score: this.curDish.score
					})
				}
				this.rateValue = e.value;
				uni.showToast({
					title: '评分成功(‾◡◝)',
					duration: 1000
				})
			},
			// Change the campus
			changeCampus(item, index) {
				this.searchQuery.curCampus = item.value;
				this.$forceUpdate();
				this.getData({
					curCampus: this.searchQuery.curCampus,
					type: "",
					value: null,
					limit: 10,
					offset: 0,
				});
				for (let i = 0; i < 6; i++) {
					this.curClassification = -1;
				}
				this.curCampusIndex = index;
			},
			// Change the classification
			changeClass(item, index) {
				this.isCurClassification = !this.isCurClassification;
				let thisRef = 'classificationRef' + index;
				this.searchQuery.type = 'classification';
				this.searchQuery.value = item.value;
				if (this.isCurClassification) {
					const that = this;
					this.getData(this.searchQuery);
					for (let i = 0; i < 6; i++) {
						this.curClassification = -1;
					}
					this.curClassification = index;
				} else {
					this.curClassification = -1;
					this.getData({
						curCampus: this.searchQuery.curCampus,
						type: "",
						value: null,
						limit: 10,
						offset: 0,
					});
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	* {
		margin: 0;
		padding: 0;
	}

	.index {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		// background-color: #f9f9f9;
		.popup-content {
			position: relative;
			width: 360px;
			height: 240px;
			border-radius: 10px;
			display: flex;
			flex-direction: column;
			align-items: center;

			.detail {
				width: 352.8px;
				margin-top: 20px;
				display: flex;

				img {
					width: 180px;
					height: 120px;
				}

				.text {
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;

					text {
						margin-top: 10px;
					}
				}
			}

			.title {
				font-size: 25px;
				font-weight: 700;
				margin-top: 10px;
			}

			.expand {
				position: absolute;
				display: flex;
				width: 100%;
				bottom: 10px;
				justify-content: space-around;
				font-size: 15px;

				view {
					display: flex;
					justify-content: center;
				}
			}
		}


		.header {
			width: 94%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 5px 0;

			.tab {
				position: relative;
				width: 100%;
				height: 70rpx;
				line-height: 60rpx;
				padding-bottom:10px;
				border-bottom: 1px solid $uni-base-c3;

				.poem {
					position: absolute;
					right: 10px;
					color: black;
					font-size: 14px;
				}
			}

			text {
				font-size: 40rpx;
				padding: 5px;
				color: rgba(128, 128, 128, .4);
				transition: .5s;
			}

			// input {
			// 	width: 280rpx;
			// 	border-bottom: 1px solid $uni-border-color;
			// 	margin-right: 5px;
			// 	text-indent: 10rpx;
			// }

			.campusActive {
				font-size: 30px;
				// color: $uni-base-c4;
				color: black;
			}
		}

		.classification {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			align-items: center;
			padding: 5px 0;
			font-weight: 700;

			text {
				width: 102px;
				height: 50px;
				text-align: center;
				line-height: 50px;
				margin: 3px 10px;
				display: block;
				border-radius: 10px;
				border: 1px solid $uni-base-c1;

				transition: .5s;
				// background-color: $uni-base-c1;
				// color: white;
			}
		}

		.filter {
			width: 98%;
			background-color: aquamarine;
			display: flex;
			padding: 5px;

			text {
				margin: 0 10px;
			}
		}

		.dishList {
			width: 98%;
			margin: 5px 0;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;

			li {
				position: relative;
				list-style: none;
				width: 92%;
				height: 90px;
				border-radius: 5px;
				border: 1px solid $uni-base-c1;
				margin: 3px 0;
				display: flex;
				flex-direction: column;
				text-indent: 10px;

				.window {
					height: 30px;
					font-size: 16px;
					line-height: 30px;

				}

				.name_price {
					font-size: 20px;
					display: flex;
					justify-content: space-between;

					.price {
						margin-right: 40px;

						text {
							font-size: 10px;
						}
					}
				}

				.time {
					position: absolute;
					bottom: 5px;
					font-size: 5px;
					color: $text-color-annotation;
				}

			}
		}

		.classificationActive {
			background-color: black;
			color: white;
		}

		.campusActive {
			font-size: 60rpx;
			// color: $uni-base-c4;
		}

		.likeCollectActive {
			color: red;
		}

		.scoreActive {
			color: #ffca3e;
		}
	}
</style>
