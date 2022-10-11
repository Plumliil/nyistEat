<script>
	import {
		cache
	} from './util/utils.js'
	export default {
		onLaunch: function() {
			// console.log(1111);
			const that = this;
			uni.getSystemInfo({
				success(res) {
					that.globalData.statusBarHeight = res.statusBarHeight;
				}
			})
			let user = cache('NyistEatUser');
			console.log(user);
			// let token = user.token;
			if (user) {
				console.log('token success');
				// plus.navigator.closeSplashscreen();
				uni.reLaunch({
					url: "pages/index/index",
					// url: "pages/user/user",
					success: () => {
						plus.navigator.closeSplashscreen();
					}
				})
			} else {
				console.log('token error');
				uni.reLaunch({
					url: "/pages/signin/signin",
					success: () => {
						plus.navigator.closeSplashscreen();
					}
				})
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData:{
			statusBarHeight:'',//手机顶部状态栏高度
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url('./common/css/global.css');
</style>
