<template>
	<view class="mark" v-if="isLoading" :style="{top:top}">
		<view class="loading">
			<text class="ball1"></text>
			<text class="ball2"></text>
			<text class="ball3"></text>
			<text class="ball4"></text>
			<text class="ball5"></text>
		</view>
	</view>
</template>

<script>
	export default {
		name:'loading',
		props:{
			isLoading:{
				type:Boolean,
				required:true
			},
			top:{
				type:String,
				default:'50px'
			},
			height:{
				type:String,
				default:'100%',
				required:false
			}
		}
	}
</script>

<style lang="scss" scoped>
	$weibo:#fa7d3c;
	$tieba:#47a8ed;
	$bili:#fb7299;
	$zhihu:#0066ff;
	$baidu:#e10602;
	.mark{
		position: fixed;
		background-color: white;
		width: 100%;
		height: 100%;
		// top: 52px;
		color: $uni-text-color;
		z-index: 999;
		.loading{
			 width: 30px;
			 height: 30px;
			 border-radius: 50%;
			 margin: 0 auto;
			 margin-top:200px;
			 position: relative;
			 border:1px solid $uni-text-color;
			 -webkit-animation: turn 2s linear infinite;
			 text{
				 display: inline-block;
				 width: 5px;
				 height: 5px;
				 border-radius: 50%;
				 // background: $uni-text-color;
				 position: absolute;
				 // -webkit-animation: changeBgColor 2s linear infinite;
			 }
			 .ball1{
				 top:0;
				 left: 0;
				 background: $weibo;
				 // -webkit-animation: changeBgColor1 4s linear infinite;
			 } 
			 .ball2{
				 left: 25px;
				 background: $tieba;
				 // -webkit-animation: changeBgColor2 4s linear infinite;
			 } 
			 .ball3{
				 top: 25px;
				 left: 25px;
				 background: $bili;
				 // -webkit-animation: changeBgColor3 4s linear infinite;
			 }
			 .ball4{
				 top: 25px;
				 left: 0;
				 background: $zhihu;
				 // -webkit-animation: changeBgColor4 4s linear infinite;
			 }
			.ball5{
				 top: 12.5px;
				 left: 12.5px;
				 background: $baidu;
				 // -webkit-animation: changeBgColor5 4s linear infinite;
			 }
			 // @-webkit-keyframes changeBgColor1{
			 //     0%{
			 //         background: #fa7d3c;
			 //     }
			 //     50%{
			 //         background: $uni-text-color;
			 //     }
				//  100%{
			 //         background: #fa7d3c;
			 //     }
			 // } @-webkit-keyframes changeBgColor2{
			 //     0%{
			 //         background: #47a8ed;
			 //     }
				//  50%{
				//      background: $uni-text-color;
				//  }
			 //     100%{
			 //         background: #47a8ed;
			 //     }
			 // } @-webkit-keyframes changeBgColor3{
			 //     0%{
			 //         background: #fb7299r;
			 //     }
				//  50%{
				//      background: $uni-text-color;
				//  }
			 //     100%{
			 //         background: #fb7299;
			 //     }
			 // } @-webkit-keyframes changeBgColor4{
			 //     0%{
			 //         background: #0066ff;
			 //     }
				//  50%{
				//      background: $uni-text-color;
				//  }
			 //     100%{
			 //         background: #0066ff;
			 //     }
			 // } @-webkit-keyframes changeBgColor5{
			 //     0%{
			 //         background: #e10602;
			 //     }
				//  50%{
				//      background: $uni-text-color;
				//  }
			 //     100%{
			 //         background: #e10602;
			 //     }
			 // }
			 @-webkit-keyframes turn{
			     0%{
			         border:1px solid $weibo;
					 -webkit-transform: rotate(0deg);
			     }
				 20%{
					 border:1px solid $tieba;
					 -webkit-transform: rotate(72deg);
				 }
				 40%{
					 border:1px solid $bili;
					 -webkit-transform: rotate(144deg);
				 }
			     60%{
					 border:1px solid $zhihu;
			         -webkit-transform: rotate(216deg);
			     }
				 80%{
					 border:1px solid $baidu;
					 -webkit-transform: rotate(288deg);
				 }
				 100%{
					 border:1px solid $weibo;
					 -webkit-transform: rotate(360deg);
				 }
			 }
		}
	}
</style>
