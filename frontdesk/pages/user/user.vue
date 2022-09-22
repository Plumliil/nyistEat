<template>
	<view class="user">
		<uni-section title="个人资料" type="line">
			<uni-card title="zhansgan" :isFull="true" sub-title="id:asjdhf293f981hgf1" extra="额外信息" :thumbnail="avatar">
			</uni-card>
		</uni-section>
		<uni-section class="functionList" title="功能列表" type="line">
			<uni-collapse>
				<uni-collapse-item title="我的收藏" thumb="https://s2.loli.net/2022/09/22/bLxo56YGOqfN3K7.png">
					<view class="content">
						<text class="text">折叠内容主体，可自定义内容及样式</text>
					</view>
				</uni-collapse-item>
			</uni-collapse>
			<uni-collapse>
				<uni-collapse-item title="我的点赞" thumb="https://s2.loli.net/2022/09/22/qPs5wA4bmzr8Mng.png">
					<view class="content">
						<text class="text">折叠内容主体，可自定义内容及样式</text>
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
	export default {
		data() {
			return {
				avatar: '../../static/img/userM.png',
				extraIcon: {
					color: '#4cd964',
					size: '22',
					type: 'gear-filled'
				},
			}
		},
		methods: {
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
			},
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
				margin: 0 auto;
			}
		}
	}
</style>
