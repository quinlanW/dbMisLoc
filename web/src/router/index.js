import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Browse from "../views/Browse.vue";
import Download from "../views/Download.vue";
import Help from "../views/Help.vue";
import Search from "../views/Search.vue";
import Visualization from "../views/Visualization.vue";
import Blast from "../views/Blast.vue";
import P404 from "../views/P404.vue";


Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        redirect: "/home"
    },
    {
        path: "/home",
        name: "Home",
        component: Home
    },
    {
        path: "/browse",
        name: "Browse",
        component: Browse
    },
    {
        path: "/search",
        name: "Search",
        component: Search
    },
    {
        path: "/visualization",
        name: "Visualization",
        component: Visualization
    },
    {
        path: "/blast",
        name: "Blast",
        component: Blast
    },
    {
        path: "/download",
        name: "Download",
        component: Download
    },
    {
        path: "/help",
        name: "Help",
        component: Help
    },
    {
        path: '/404',
        component: P404,
        hidden: true
    },
    // 404 page must be placed at the end !!!
    {
        path: '*',
        redirect: '/404',
        hidden: true
    },
];

const router = new VueRouter({
    routes,
    mode: "history"
});

export default router;