<template>
	<view class="index">
		<view class="header">
			<view class="tab">
				<text v-for="(item,index) in campus" :class="curCampus===index?'active':''"
					@tap="changeCampus(item,index)">{{item.label}}</text>
			</view>
			<input type="text" placeholder="吃点啥...">
		</view>
		<view class="classification">
			<text v-for="(item,index) in classification" :ref="'classificationRef'+index">
				{{item.label}}
			</text>
		</view>
		<view class="filter">
			<view class="uni-list-cell-left">
				当前选择
			</view>
			<text>筛选</text>
			<view class="uni-list-cell-db">
				<picker @change="bindPickerChange" :value="index" :range="array">
					<view class="uni-input">{{array[index]}}</view>
				</picker>
			</view>
		</view>
		<ul class="dishList">
			<li v-for="(item,index) in dishData" :key="index">
				<text class="window">{{item.window}}</text>
				<view class="name_price">
					<text>{{item.name}}</text>
					<text class="price"><text>定价: </text>{{item.price}}</text>
				</view>
				<text class="time">更新日期: {{item.updatedAt.substring(0,10)}}</text>
			</li>
		</ul>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				campus: [
					{
					label: '南苑',
					value: 'headOfTheSouth'
				},
				{
					label: '西苑',
					value: 'headOfTheSouth'
				},
				{
					label: '东校区',
					value: 'eastCampus'
				},
				],
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
				curCampus: 0,
				searchQuery: {
					type: "",
					value: "",
					limit: 10,
					offset: 0,
				},
				index: 0,
				array: ['中国', '美国', '巴西', '日本'],
				dishData: []
			}

		},
		onLoad() {
			this.getData()
		},
		methods: {
			getData(type, value, limit = 10, offset = 0) {
				uni.request({
					url: `http://localhost:3366/api/dish/get?type=${type}&value=${value}&limit=${limit}&offset=${offset}`,
					method: 'GET',
					success: (res) => {
						this.dishData = res.data.list;
					},
					fail: (err) => {
						console.log(err);
					}
				})
			},
			changeCampus(item, index) {
				console.log(item.value);
				console.log(index);
				// console.log(this.$refs['classification0']);
				// console.log(this.$refs);
			}, 
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.index = e.detail.value
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
		display: flex;
		flex-direction: column;
		justify-content: center;

		align-items: center;

		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.tab {
				height: 70rpx;
				line-height: 60rpx;
				margin-right: 40px;
			}

			text {
				font-size: 40rpx;
				padding: 5px;
				color: rgba(128, 128, 128, .5);
			}

			input {
				width: 280rpx;
				border-bottom: 1px solid $uni-border-color;
				margin-right: 5px;
				text-indent: 10rpx;
			}

			.active {
				font-size: 60rpx;
				color: black;
			}
		}

		.classification {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			align-items: center;
			margin-top: 5px;
			padding: 5px 0;

			text {
				width: 100px;
				height: 50px;
				text-align: center;
				line-height: 50px;
				margin: 3px 10px;
				background-color: #cccccc;
				display: block;
				border-radius: 10px;
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
			background-color: aqua;
			border-bottom: 1px solid $uni-border-color;
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
				background-color: antiquewhite;
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
					.price{
						margin-right: 40px;
						text{
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
	}
</style>
