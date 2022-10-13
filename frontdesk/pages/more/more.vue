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
						<button @tap="changeDishes" v-if="!isEmpty">换一批</button>
						<button @tap="resetDishes" v-if="isEmpty">重置</button>
						<button @tap="chooseDish" v-if="!isEmpty">开始</button>
					</view>
				</view>
				<view class="dishList" v-if="!isEmpty">
					<li v-for="(item,index) in dishList" :class="curChoose===index?'isChoose':''"
						:style="{width:item.rdmWidth+'px'}">
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
								{{item.score[0]?item.score[0]:0}}
								<text style="color: gray;font-size: 10px">分/</text>
							</text>
							<text class="num">{{item.score[1]}}人</text>
						</view>
						<view v-else-if="rankValue==='like'">
							<text class="num">{{typeof item.like==='object'?item.like.length:0}}人</text>
						</view>
						<view v-else>
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
					<img :src="chooseDishData.image" alt="">
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
					value: "",
					limit: 14,
					offset: 0,
				},
				dishList: [],
				rankList: [],
				curChoose: -1,
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
				}],
				allTotal: 0,
				curTotal: 0
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
			let curTotal = this.dishList.length;

			if (this.allTotal > curTotal) {
				//当前条数小于总条数 则增加请求页数
				curTotal += 3;
				let query = Object.assign(this.searchQuery, {
					limit: curTotal
				})
				uni.showLoading({
					title: '加载中'
				});
				setTimeout(() => {
					this.getDishData(query);
					uni.hideLoading();
				}, 1500);
			} else {
				uni.showLoading({
					title: '加载中'
				});
				setTimeout(() => {
					uni.hideLoading();
					uni.showToast({
						title: '已加载全部数据',
						duration: 2000
					});
				}, 1000);

			}
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
				this.allTotal = data.count;
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
						return b[this.rankValue][0] - a[this.rankValue][0];
					} else {
						return b[this.rankValue].length - a[this.rankValue].length;
					}
				})
			},
			onchange(e) {
				this.isEmpty = false;
				let address = [];
				if (e.detail.value.length !== 0) {
					e.detail.value.forEach(item => {
						address.push(item.value);
					})
				}
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
					this.isEmpty = true;
					this.searchQuery.offset = 0;
				}
			},
			resetDishes(){
				this.isEmpty = false;
				this.getDishData(this.searchQuery);
				// this.searchQuery.offset = 0;
			},
			chooseDish() {
				if (this.dishList.length === 0) return uni.showToast({
					title: '餐品未收录'
				});
				let len = this.dishList.length - 1;
				let beginTimer = setInterval(() => {
					for (let i = 0; i <= len; i++) {
						this.curChoose = -1;
					}
					let rdmIndex = this.getRandomNum(0, len);
					this.chooseDishData = this.dishList[rdmIndex];
					this.curChoose = rdmIndex;
				}, 100)
				setTimeout(async () => {
					clearInterval(beginTimer);
					if (!this.user.rdmHistory) {
						this.user.rdmHistory = [];
					}
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
					this.userData.data = this.user;
					cache('NyistEatUser', this.userData);
					this.chooseDishData.address = transAddress(this.chooseDishData.address).join('-');
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
						if (a['score'].lengt === 1 || a['score'].lengt === 0 || b['score'].length === 1 || b[
								'score'].length === 0) {
							return b['score'].length - a['score'].length
						} else {
							return b['score'][0] - a['score'][0];
						}
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

					view {
						.value {
							font-size: 16px;
						}

						.num {
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


		.isChoose {
			background-color: #f98082;
			color: white;
			box-shadow: 5px 5px 10px .3px gray;
		}
	}
</style>
