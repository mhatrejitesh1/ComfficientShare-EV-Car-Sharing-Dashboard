<template>
    <main v-if="settings != null">
        <!-- Map -->
        <Map view="panel" :map="map" :settings="settings" v-on:map-controler-init="mapControllerInit"
            @vnode-mounted="onMounted" />

        <!-- Map Info -->
        <!-- <div class="info-container-main" id="map-info"> </div> -->

        <!-- Map Title -->
        <div id="map-title" class="table-view"></div>

        <!-- Divider -->
        <hr class="divider" />

        <!-- Bottom Container -->
        <div id="map-footer" class="table-view"></div>
    </main>
</template>
    
<script>
// Import components
import Map from "@/components/Map.vue";
import ProjectPanel from "@/components/MainView/ProjectPanel.vue";

export default {

    name: "MapView",
    // Components of the app
    components: {
        Map,
        ProjectPanel
    },
    props: {
        query: Object,
        map: String
    },
    async mounted() {
        console.log(this.query)
        const initialState = { lng: 11.5761, lat: 48.15, zoom: 11.5 };
        this.bounds = JSON.parse(this.query.bounds);
        this.settings = {
            style: "https://api.maptiler.com/maps/a7411f7b-1ce4-4d46-91d3-829ee4b8ec7a/style.json?key=TPvsAam5oQQKUZqCfqav",
            center: [initialState.lng, initialState.lat],
            zoom: initialState.zoom,
            minZoom: 10,
            maxZoom: 18,
            attributionControl: false,
            scrollZoom: false,
            boxZoom: false,
            dragRotate: false,
            doubleClickZoom: false,
            touchZoomRotate: false,
            touchPitch: false
        }
    },
    data() {
        return {
            // List of projects that are shown inside the application
            mapController: { activeMaps: [] },
            settings: null,
            bounds: null,
        }
    },
    methods: {
        // Used for project buttons to change the value of the selected project
        changeView(index) {
            for (let i = 0; i < this.viewSetup.length; i++) {
                if (i == index) {
                    this.mapController.toggleMap(this.viewSetup[i].map);
                    break;
                }
            }
        },
        mapControllerInit(controller) {
            this.mapController = controller;
            this.mapController.map.fitBounds(this.bounds);
        },
        onMounted() {

        }
    },
    computed: {}
}
</script>
    
<style>
@import "maplibre-gl/dist/maplibre-gl.css";

.lower-left {
    width: 35vh;
    position: fixed;
    bottom: 25vh;
    left: -0.85%;
    z-index: 5;
    -moz-transform: rotate(90deg);
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
}

.upper-left {
    width: 35vh;
    position: fixed;
    top: 3vh;
    left: -0.85%;
    z-index: 5;
    transform: rotate(90deg);
}

.top-left {
    width: 28vw;
    transform: rotate(180deg);
    z-index: 5;
    position: fixed;
    top: 0;
    left: 20%;
}

.top-right {
    width: 28vw;
    transform: rotate(180deg);
    z-index: 5;
    position: fixed;
    top: 0;
    left: 52%;
}

.lower-right {
    width: 35vh;
    position: fixed;
    bottom: 25vh;
    right: -0.85%;
    z-index: 5;
    transform: rotate(-90deg);
}

.upper-right {
    width: 35vh;
    position: fixed;
    top: 3vh;
    right: -0.85%;
    z-index: 5;
    transform: rotate(-90deg);
}

.table-view {
    width: 100%;
    position: absolute;
    bottom: 5vh;
    display: flex;
    justify-content: space-evenly;
}

.panel-button {
    background-color: rgb(0, 101, 189);
    color: aliceblue;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.4), 0 6px 20px 0 rgba(0, 0, 0, 0.4);
    border-radius: 4px;
    font-size: 22px;
    padding-top: 10px;
    padding-bottom: 10px;
    width: 13vw;
}

.panel-info-container {
    background-color: rgb(0, 101, 189);
    color: aliceblue;
    border-radius: 4px;
    font-size: 22px;
    padding: 8px;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 5vh;
    width: fit-content;
    display: flex;
    justify-content: space-evenly;
}
</style>