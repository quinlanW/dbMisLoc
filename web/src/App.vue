<template>
  <div id="app">
    <app-header></app-header>
    <!-- <router-view></router-view> -->
    <!-- Click on the navigation bar to jump to introduce -->
    <router-view v-if="isRouterAlive"></router-view>
    <app-footer></app-footer>
  </div>
</template>

<script>
import header from "./components/Header.vue"
import footer from "./components/Footer.vue"

export default {
  name: 'App',
	provide(){ // Click on the navigation bar to jump to introduce
		return{
			reload: this.reload
		}
	},
	data(){  // Click on the navigation bar to jump to introduce
		return {
			isRouterAlive: true
		}
	},
	components: {
		appHeader: header,
		appFooter: footer
	},
	methods: { // Click on the navigation bar to jump to introduce
		reload(){
			this.isRouterAlive = false
			this.$nextTick(function () {
				this.isRouterAlive = true
			})
		}
	}
}
</script>

<style>
html,
body,
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #202122; */
  margin: 0;
  padding: 0;
  height: 100%;
}
ul,
li {
  list-style: none;
}
a {
  text-decoration: none;
}
.app-main {
  /* position: absolute;
  margin-top: 0; */
  width: 100%;
  /* height: 100%; */
  padding: 20px 0;
  margin: 0;
  -webkit-box-shadow: 0px 0px 5px #ccc;
  -moz-box-shadow: 0px 0px 5px #ccc;
  -ms-box-shadow: 0px 0px 5px #ccc;
  box-shadow: 0px 0px 5px #ccc;
  /* background: #e6f0ef; */
  background: #e6f0ef; /* Old browsers */
  background: -moz-linear-gradient(
    -45deg,
    #e6f0ef 45%,
    #b4ede7 100%
  ); /* FF3.6-15 */
  background: -webkit-linear-gradient(
    -45deg,
    #e6f0ef 45%,
    #b4ede7 100%
  ); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    135deg,
    #e6f0ef 45%,
    #b4ede7 100%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#e6f0ef', endColorstr='#b4ede7',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */

  /* padding: 20px; */
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  -ms-border-radius: 5px;
  border-radius: 5px;
  /* padding-bottom: 40px; */
}
</style>
