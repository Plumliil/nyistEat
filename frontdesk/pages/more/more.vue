<template>
	<view class="more">
		<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="text"
			activeColor="red"></uni-segmented-control>
		<view class="rdmContent">
			<view v-show="current === 0">
				<view class="fns">
					<uni-data-picker :localdata="addressData" popup-title="请选择餐厅" @change="onchange"
						@nodeclick="onnodeclick">
					</uni-data-picker>

					<view class="btn">
						<button @tap="changeDishes">换一批</button>
						<button @tap="chooseDish">开始</button>
					</view>
				</view>
				<view class="dishList" v-if="!isEmpty">
					<li v-for="(item,index) in dishList" :ref="'dishRef'+index" :style="{width:item.rdmWidth+'px'}">
						{{item.name}},{{item.rdmWidth}}
					</li>
				</view>
				<view class="isEmpty" v-if="isEmpty">
					<text>真的一个都没有了... ＞︿＜ !</text>
				</view>
			</view>
			<view v-show="current === 1">
				<view class="fns">
					<uni-data-picker :localdata="addressData" selectedColor="red" popup-title="请选择餐厅" @change="onchange"
						@nodeclick="onnodeclick">
					</uni-data-picker>
					<view class="boxs">
						<uni-data-checkbox class="checkBox" mode="button" v-model="rankValue" :localdata="checkBoxRange"
							@change="checkBoxChange"></uni-data-checkbox>
					</view>
				</view>
				<view class="rankList">
					<li v-for="(item,index) in rankList" :ref="'dishRef'+index">
						<text>{{index+1}}:&nbsp;&nbsp;{{item.name}}</text>
							<view v-if="rankValue==='score'">
								<text class="value">
									{{item.score[0]}}
									<text style="color: gray;font-size: 10px">分/</text>
								</text>
								<text class="num">{{item.score[1]}}人</text>
							</view>
							<view v-else-if="rankValue==='like'">
								<text class="num">{{item.like.length}}人</text>
							</view>
							<view v-else="rankValue==='like'">
								<text class="num">{{item.collect.length}}人</text>
							</view>
					</li>
				</view>
			</view>

		</view>
		<!-- 普通弹窗 -->
		<uni-popup class="popup" ref="popup" background-color="#fff">
			<view class="popup-content">
				<text class="title">{{chooseDishData.name}}</text>
				<view class="detail">
					<img src="https://s2.loli.net/2022/09/16/pjZ5atWzcGyPlYq.jpg" alt="">
					<view class="text">
						<text class="window">{{chooseDishData.window}}</text>
						<text class="address">{{chooseDishData.address}}</text>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		sort,
		cache,
		timeFormat,
		transAddress
	} from '@/util/utils.js';
	import {
		getDish,
		updateUser
	} from '../../util/request/api.js'
	import uniDataPicker from "@/components/uni-data-picker_1.0.8/components/uni-data-picker/uni-data-picker.vue"
	import uniDataCheckbox from "@/components/uni-data-checkbox_1.0.3/components/uni-data-checkbox/uni-data-checkbox.vue"
	export default {
		components: {
			uniDataPicker,
			uniDataCheckbox
		},
		data() {
			return {
				user: {},
				userData: {},
				items: ['随机', '榜单'],
				current: 0,
				searchQuery: {
					type: "",
					value: null,
					limit: 15,
					offset: 0,
				},
				dishList: [],
				rankList: [],
				isEmpty: false,
				addressData: [{
						value: "",
						text: "全部",
					}, {
						value: "eastCampus",
						text: "东校区",
					},
					{
						value: "headOfTheSouth",
						text: "本部南苑",
						children: [{
								value: "minzu",
								text: "民族餐厅",
							},
							{
								value: "fengwei",
								text: "风味餐厅",
							},
							{
								value: "zhuyao",
								text: "南苑餐厅",
								children: [{
										value: "firstFloor",
										text: "一楼",
									},
									{
										value: "secondFloor",
										text: "二楼",
									},
								],
							},
						],
					},
					{
						value: "headOfTheWest",
						text: "本部西苑",
						children: [{
								value: "firstFloor",
								text: "一楼",
							},
							{
								value: "secondFloor",
								text: "二楼",
							},
						],
					},
				],
				chooseDishData: {},
				rankValue: 'like',
				checkBoxRange: [{
					"value": 'like',
					"text": "点赞"
				}, {
					"value": 'collect',
					"text": "收藏"
				}, {
					"value": 'score',
					"text": "评分"
				}]
			}
		},
		onShow() {
			this.userData = cache('NyistEatUser');
			if (this.userData) {
				this.user = this.userData.data
			}
			this.getDishData(this.searchQuery);
			// this.rankList = this.dishList;
		},
		onReachBottom() {
			console.log('上拉加载');
			// if (allTotal < this.total) {
			// 	//当前条数小于总条数 则增加请求页数
			// 	this.page++;
			// 	this.getData() //调用加载数据方法
			// } else {
			// 	// console.log('已加载全部数据')
			// }
		},
		methods: {
			// 洗牌
			xipai(arr) {
				arr.sort(() => {
					return Math.random() - 0.5;
				})
				return arr;
			},
			onClickItem(e) {
				if (this.current != e.currentIndex) {
					this.current = e.currentIndex;
				}
			},
			getRandomNum(min, max) {
				return Math.floor(Math.random() * (max - min + 1) + min);
			},
			async getDishData(options) {
				const data = await getDish(options);
				this.dishList = data.list;

				this.dishList = this.xipai(this.dishList)
				// 随机大小
				this.dishList.forEach((item, index) => {
					let rdmWidth = this.getRandomNum(70, 200);
					let rdmHeight = this.getRandomNum(90, 250);
					if (index % 2 === 0) {
						item.rdmWidth = rdmWidth;
						item.rdmHeight = rdmHeight;
					} else {
						item.rdmWidth = rdmHeight;
						item.rdmHeight = rdmWidth;
					}
				})
				// 榜单
				// rankValue 当前选择的某一个榜单
				this.rankList = data.list;
				this.rankList.sort((a, b) => {
					a[this.rankValue] = a[this.rankValue] === null ? [] : a[this.rankValue];
					b[this.rankValue] = b[this.rankValue] === null ? [] : b[this.rankValue];
					if (this.rankValue === 'score') {
						// a[this.rankValue] = a[this.rankValue].length === 0 ? [0] : a[this.rankValue];
						// b[this.rankValue] = b[this.rankValue].length === 0 ? [0] : b[this.rankValue];
						return b[this.rankValue][0] - a[this.rankValue][0];
					} else {
						return b[this.rankValue].length - a[this.rankValue].length;
					}
				})
				console.log(this.dishList);
			},
			onchange(e) {
				this.isEmpty = false;
				console.log(this.rankValue);
				let address = [];
				if (e.detail.value.length !== 0) {
					e.detail.value.forEach(item => {
						address.push(item.value);
					})
				}
				console.log('address', address);
				this.searchQuery.type = 'address';
				this.searchQuery.value = address;
				this.searchQuery.offset = 0;
				this.getDishData(this.searchQuery);
			},
			onnodeclick(node) {},
			changeDishes() {
				this.searchQuery.offset = this.searchQuery.offset + 5;
				this.getDishData(this.searchQuery);
				if (this.dishList.length < this.searchQuery.limit) {
					console.log(this.dishList);
					this.isEmpty = true;
					this.searchQuery.offset = 0;
				}
			},
			chooseDish() {
				if (this.dishList.length === 0) return uni.showToast({
					title: '餐品未收录'
				});

				let len = this.dishList.length - 1;
				let beginTimer = setInterval(() => {
					for (let i = 0; i <= len; i++) {
						let otherDishRef = 'dishRef' + i;
						this.$refs[otherDishRef][0].className = '';
					}
					let rdmIndex = this.getRandomNum(0, len);
					let curDishRef = 'dishRef' + rdmIndex;
					this.$refs[curDishRef][0].className = 'isChoose';
					this.chooseDishData = this.dishList[rdmIndex]
				}, 100)
				setTimeout(async () => {
					clearInterval(beginTimer);
					if (!this.user.rdmHistory) {
						this.user.rdmHistory = [];
					}
					console.log(this.chooseDishData);
					this.user.rdmHistory.push({
						_id: this.chooseDishData._id,
						name: this.chooseDishData.name,
						classification: this.chooseDishData.classification,
						window: this.chooseDishData.window,
						time: timeFormat('MM-DD hh-mm')
					});
					const updateUserState = await updateUser({
						_id: this.user._id,
						rdmHistory: this.user.rdmHistory
					});
					console.log(updateUserState);
					this.userData.data = this.user;
					cache('NyistEatUser', this.userData);
					this.chooseDishData.address = transAddress(this.chooseDishData.address).join('-');
					// console.log(this.chooseDishData);
					this.$refs.popup.open('center')
				}, 3000)
			},
			checkBoxChange(e) {
				let type = e.detail.value;
				this.rankValue = e.detail.value;
				this.rankList.sort((a, b) => {
					a[this.rankValue] = a[this.rankValue] === null ? [] : a[this.rankValue];
					b[this.rankValue] = b[this.rankValue] === null ? [] : b[this.rankValue];
					if (this.rankValue === 'score') {
						// a[this.rankValue] = a[this.rankValue].length === 0 ? [0] : a[this.rankValue];
						// b[this.rankValue] = b[this.rankValue].length === 0 ? [0] : b[this.rankValue];
						return b[this.rankValue][0] - a[this.rankValue][0];
					} else {
						return b[this.rankValue].length - a[this.rankValue].length;
					}
				})
			}
		},
	}
</script>


<style lang="scss" scoped>
	.more {
		width: 100vw;
		height: 94vh;

		.rdmContent {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;

			.fns {
				display: flex;
				justify-content: center;
				align-items: center;
				min-width: 300px;
				height: 40px;

				.btn {
					width: 150px;
					display: flex;
					justify-content: center;
					align-items: center;

					button {
						width: 64px;
						height: 36px;
						line-height: 36px;
						font-size: 12px;
						background: none;
						font-weight: 700;
					}
				}

				.checkBox {
					display: flex;
					justify-content: center;
					align-items: center;
				}

			}

			.dishList {
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-around;

				li {
					background-color: white;
					margin: 8px 8px;
					position: relative;
					padding: 10px 5px;
					box-shadow: 5px 5px 10px .3px #f98082;
					box-sizing: border-box;
					border-radius: 5px;
				}

				.isChoose {
					background-color: #f98082;
					color: white;
					box-shadow: 5px 5px 10px .3px gray;
				}
			}

			.rankList {
				width: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				li {
					width: 300px;
					list-style: decimal;
					background-color: white;
					margin: 8px 8px;
					position: relative;
					padding: 10px 5px;
					box-shadow: 0px 4px 10px 0px red;
					box-sizing: border-box;
					border-radius: 5px;
					display: flex;
					justify-content: space-between;
					view{
						.value{
							font-size: 16px;
						}
						.num{
							font-size: 10px;
							color: rgba(128, 128, 128, .5);
						}
					}
				}

			}


			.isEmpty {
				display: flex;
				justify-content: center;
				align-items: center;
				line-height: 300px;

				text {
					font-size: 20px;
					font-weight: 700;
					color: $uni-text-color-grey;
				}
			}
		}

		.popup-content {
			position: relative;
			width: 360px;
			height: 180px;
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
		}

	}
</style>
