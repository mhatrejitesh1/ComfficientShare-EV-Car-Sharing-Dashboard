import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import { library } from "@fortawesome/fontawesome-svg-core"
import { faChevronUp, faChevronDown, faCircleInfo, faMagnifyingGlassPlus, faMagnifyingGlassMinus, faCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

import App from './App.vue'
import MainOneTopic from '@/projects/ComfficientShare/Dashboards/OneTopic.vue'
import Panel from '@/views/Panel.vue'
import MapView from "@/views/MapView.vue"
import Dashboard from "@/views/Dashboard.vue"
import Render from "@/views/Render.vue"

import './assets/main.css'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'OneTopic', component: MainOneTopic },
        { path: '/panel/:template(.*)', name: 'Panel', component: Panel, props: true },
        { path: '/map/:map(.*)', name: 'Map', component: MapView, props: true },
        { path: '/render/:map(.*)', name: 'Render', component: Render, props: (route) => ({ query: route.query, map: route.params.map }) },
        { path: '/dashboard/:dashboard(.*)', name: 'Dashboard', component: Dashboard, props: true },
    ]
})

library.add(faChevronUp, faChevronDown, faCircleInfo, faMagnifyingGlassPlus, faMagnifyingGlassMinus, faCircle)
createApp(App).use(router).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
