<template>
	<view class="index">
		<!-- <view-loader :isLoading="isLoading" top="0"></view-loader> -->
		<view class="header">
			<view class="tab">
				<text v-for="(item,index) in campus" :class="curCampusIndex===index?'campusActive':''"
					@tap="changeCampus(item,index)">{{item.label}}</text>
			</view>
			<input type="text" placeholder="吃点啥...">
		</view>
		<view class="classification">
			<text v-for="(item,index) in classification" :ref="'classificationRef'+index"
				@tap="changeClass(item,index)">
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
		<uni-popup class="popup" ref="popup" background-color="#fff" @change="change">
			<view class="popup-content">
				<text class="title">{{curDish.name}}</text>
				<view class="detail">
					<img src="https://s2.loli.net/2022/09/16/pjZ5atWzcGyPlYq.jpg" alt="">
					<view class="text">
						<text class="window">{{curDish.window}}</text>
						<text class="address">{{curDish.address}}</text>
					</view>
				</view>
				<view class="expand">
					<view class="" ref="likeRef" @tap="like">
						<uni-icons type="hand-up" size="20"></uni-icons>:点赞
					</view>
					<view class="" ref="collectRef" @tap="collect">
						<uni-icons type="plusempty" size="20"></uni-icons>:收藏
					</view>
					<view class="" ref="scoreRef" @tap="score">
						<uni-icons type="starhalf" size="20"></uni-icons>:
						<uni-rate allow-half :size="20" :value="rateValue" />
					</view>
				</view>
			</view>
		</uni-popup>

	</view>
</template>

<script>
	import utils from '../../util/utils.js'
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
					{
						label: '东校区',
						value: 'eastCampus'
					},
				],
				curCampusIndex: 0,
				curCampus: 'headOfTheSouth',
				classification: [{
						label: '米饭',
						value: 'rice'
					},
					{
						label: '面食',
						value: 'pasta'
					},
					{
						label: '麻辣烫',
						value: 'malatang'
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
					type: "",
					value: "",
					limit: 10,
					offset: 0,
				},
				index: 0,
				dishData: [],
				rateValue: 3.5,
				curDish: {}
			}

		},
		onLoad() {
			this.getData()
		},
		methods: {
			getData(type, value, limit = 5, offset = 0) {
				uni.request({
					url: `http://localhost:3366/api/dish/get/${this.curCampus}?type=${type}&value=${value}&limit=${limit}&offset=${offset}`,
					method: 'GET',
					success: (res) => {
						this.dishData = res.data.list;
					},
					fail: (err) => {
						console.log(err);
					}
				})
			},

			change(e) {
				console.log('当前模式：' + e.type + ',状态：' + e.show);
			},
			onChange(e) {
				console.log('rate发生改变:' + JSON.stringify(e))
			},
			dishDetail(item) {
				console.log(item);
				this.curDish = item;
				this.$refs.popup.open('center')
				if (this.curDish.address instanceof Array) {
					this.curDish.address = utils.transAddress(this.curDish.address).join('-')
				}
			},
			like() {
				console.log('like');
				uni.showToast({
					title: '点赞成功',
					duration: 1000
				})
			},
			collect() {
				console.log('collect');
				uni.showToast({
					title: '已加入收藏',
					duration: 1000
				})
			},
			score() {
				console.log('score');
			},
			changeCampus(item, index) {
				this.curCampusIndex = index;
				this.curCampus = item.value;
				this.$forceUpdate();
				this.getData();
			},
			changeClass(item, index) {
				const that = this;
				let thisRef = 'classificationRef' + index;
				this.searchQuery.type = 'classification';
				this.searchQuery.value = item.value;
				this.getData(this.searchQuery.type, this.searchQuery.value);
				for (let i = 0; i < 6; i++) {
					let otherClassRef = 'classificationRef' + i;
					this.$refs[otherClassRef][0]['$el'].className = '';
				}
				this.$refs[thisRef][0]['$el'].className = 'classificationActive';
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
					text{
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
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 5px 0;

			.tab {
				width: 220px;
				height: 70rpx;
				line-height: 60rpx;
			}

			text {
				font-size: 40rpx;
				padding: 5px;
				color: rgba(128, 128, 128, .5);
				transition: .5s;
			}

			input {
				width: 280rpx;
				border-bottom: 1px solid $uni-border-color;
				margin-right: 5px;
				text-indent: 10rpx;
			}

			.campusActive {
				font-size: 30px;
				color: black;
			}
		}

		.classification {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			align-items: center;
			padding: 5px 0;

			text {
				width: 100px;
				height: 50px;
				text-align: center;
				line-height: 50px;
				margin: 3px 10px;
				display: block;
				border-radius: 10px;
				border: 1px solid black;
				transition: .5s;
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
				// background-color: antiquewhite;
				border: 1px solid $uni-border-color;
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
			color: black;
		}
	}
</style>
