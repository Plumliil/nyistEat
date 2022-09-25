<script>
	import {
		cache
	} from './util/utils.js'
	export default {
		onLaunch: function() {
			console.log('App Launch')
			console.log('app.vue');
			let user = cache('NyistEatUser');
			console.log(user);
			let token = user.token;
			if (token) {
				console.log('token success');
				// plus.navigator.closeSplashscreen();
				uni.reLaunch({
					// url: "pages/index/index",
					url: "pages/more/more",
					success: () => {
						// plus.navigator.closeSplashscreen();
					}
				})
			} else {
				console.log('token error');
				uni.reLaunch({
					url: "/pages/signin/signin",
					success: () => {
						// plus.navigator.closeSplashscreen();
					}
				})
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url('./common/css/global.css');
</style>
