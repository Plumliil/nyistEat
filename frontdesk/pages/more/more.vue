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
				<view class="dishList">
					<li v-for="(item,index) in dishList" :ref="'dishRef'+index" :style="{width:item.rdmWidth+'px'}">
						{{item.name}},{{item.rdmWidth}}
					</li>
				</view>
			</view>
		</view>
	</view>
	</view>
</template>
<script>
	import {
		cache,
		timeFormat
	} from '@/util/utils.js';
	import {
		getDish,
		updateUser
	} from '../../util/request/api.js'
	export default {
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
							},
						],
					},
					{
						value: "headOfTheWest",
						text: "本部西苑",
					},
				],
				chooseDishData: {}
			};
		},
		onShow() {
			this.userData = cache('NyistEatUser');
			if (this.userData) {
				this.user = this.userData.data
			}
			this.getDishData(this.searchQuery);
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
			},
			onchange(e) {
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
				console.log('changeDishList');
			},
			chooseDish() {
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
						_id:this.user._id,
						rdmHistory:this.user.rdmHistory
					});
					this.userData.data = this.user;
					cache('NyistEatUser', this.userData);
					console.log(this.user);
				}, 3000)
				console.log(new Date());
			}
		}
	};
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
				// width: 100px;
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
			}

			.dishList {
				width: 100%;
				// height: 20vh;
				display: flex;
				flex-wrap: wrap;
				// flex-direction: column;
				justify-content: space-around;

				li {
					// width: 70px;
					// height: 100px;
					// background-color: aqua;
					background-color: white;
					margin: 8px 8px;
					position: relative;
					padding: 10px 5px;
					box-shadow: 5px 5px 10px .3px red;
					box-sizing: border-box;
					border-radius: 5px;
				}

				.isChoose {
					background-color: red;
					color: white;
					box-shadow: 5px 5px 10px .3px black;
				}
			}
		}

	}
</style>
