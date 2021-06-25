<template>
    <div class="webtitle">
        <nav>
            <ul class="topnav" id="dropdownClick">
                <li class="title">
                    <img
                        alt="dbMislov database"
                        src="../assets/img/header_logo2.png"
                        style="height: 65px; width: auto; vertical-align: middle; margin: 5px;"
                    />
                </li>
                <li v-for="item in menus" 
                    :key="item.id" 
                    :index="item.id" 
                    v-on:click="setname(item.name)"
                    :class="{ 'is-active': item.name == checkName }"
                >
                    <router-link :to="item.url">
                        {{ item.name }}
                    </router-link>
                </li>
                <li class="dropdownIcon">
                    <a href="javascript:void(0);" @click="dropdownMenu()">&#9776;</a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
export default{
    name: "Header",
    data(){
        return{
            title: "dbMisloc",
            menus: [
                {
                    id: 1,
                    url: "/home",
                    name: "Home"
                },
                {
                    id: 2,
                    url: "/browse",
                    name: "Browse"
                },
                {
                    id: 3,
                    url: "/search",
                    name: "Search"
                },
                {
                    id: 4,
                    url: "/visualization",
                    name: "Visualization"
                },
                {
                    id: 5,
                    url: "/blast",
                    name: "Blast"
                },
                {
                    id: 6,
                    url: "/download",
                    name: "Download"
                },
                {
                    id: 7,
                    url: "/help",
                    name: "Help"
                },
            ],
            checkName: this.$route.name 
        };
    },
    methods: {
        setname(val){
            this.checkName = val
        },
        // 响应式设计导航栏
        dropdownMenu() {
            let x = document.getElementById("dropdownClick");
            if (x.className === "topnav") {
                x.className += " responsive";
            } else {
                x.className = "topnav";
            }
        }
    },
     watch: {
        /* 监听路由，并显示导航栏的选中效果 */
        $route: {
        handler() {
            let linkName = this.$route.name;
            // console.log(linkName);
            this.checkName = linkName;
            // console.log(this.checkName);
        }
        }
    }
}
</script>

<style scoped>
nav{
    display: block;
    width: 100%;
    margin: 0;
    height: 70px;
    background-color: rgb(250, 250, 250);
    background-size: 180px 70px;
}
ul.topnav{
    margin: 0;
    padding: 0;
    overflow: hidden;
}
ul.topnav li{
    float: left;
    color: rgb(115, 200, 200);
}
ul.topnav li.title {
  padding: 0 30px;
  line-height: 70px;
  height: 70px;
}
ul.topnav li a {
  display: block;
  padding: 20px 15px;
  color: rgb(115, 200, 200);
  font-weight: bold;
  font-family: "Source Sans Pro", sans-serif !important;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 1.1em;
}
ul.topnav li a:hover {
  background: lightgray;
}
ul.topnav li.dropdownIcon {
  display: none;
}

ul.topnav .is-active a {
  background: rgb(115, 200, 200);
  color: white;
}

@media screen and (max-width: 800px) {
  ul.topnav li:not(:nth-child(1)) {
    display: none;
  }

  ul.topnav li.dropdownIcon {
    display: block;
    float: right;
  }

  ul.topnav.responsive {
    position: relative;
    background-color: rgb(250, 250, 250);
    z-index: 999;
  }

  ul.topnav.responsive li {
    float: none;
    display: block;
  }

  /* 下拉图标大小不变 */
  ul.topnav.responsive li:not(:nth-child(9)) a {
    text-align: left;
    height: 0 !important;
    line-height: 0 !important;
    font-size: 1em !important;
  }
  /* ul.topnav.responsive li:nth-child(2) {
    border-top: 1px solid;
    border-top-color: gray;
  } */
  ul.topnav.responsive li.dropdownIcon {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>