<template>
    <main v-if="initialMap != null">
        <!-- Panels -->
        <div class="lower-left">
            <ProjectPanel @mapSelected="changeView(0)" :project="viewSetup[0].title" :file="viewSetup[0].template"
                :selected="this.mapController.activeMaps.includes(viewSetup[0].map)" :id="'lower-left'" />
        </div>
        <div class="upper-left">
            <ProjectPanel @mapSelected="changeView(1)" :project="viewSetup[1].title" :file="viewSetup[1].template"
                :selected="this.mapController.activeMaps.includes(viewSetup[1].map)" :id="'upper-left'" />
        </div>
        <div class="top-left">
            <ProjectPanel @mapSelected="changeView(2)" :project="viewSetup[2].title" :file="viewSetup[2].template"
                :selected="this.mapController.activeMaps.includes(viewSetup[2].map)" :id="'top-left'" :top="true" />
        </div>
        <div class="top-right">
            <ProjectPanel @mapSelected="changeView(0)" :project="viewSetup[0].title" :file="viewSetup[0].template"
                :selected="this.mapController.activeMaps.includes(viewSetup[0].map)" :id="'top-right'" :top="true" />
        </div>
        <div class="upper-right">
            <ProjectPanel @mapSelected="changeView(1)" :project="viewSetup[1].title" :file="viewSetup[1].template"
                :selected="this.mapController.activeMaps.includes(viewSetup[1].map)" :id="'upper-right'" />
        </div>
        <div class="lower-right">
            <ProjectPanel @mapSelected="changeView(2)" :project="viewSetup[2].title" :file="viewSetup[2].template"
                :selected="this.mapController.activeMaps.includes(viewSetup[2].map)" :id="'lower-right'" />
        </div>

        <!-- Map -->
        <Map :map="initialMap.map" :settings="this.settings" v-on:map-controler-init="mapControllerInit" />

        <!-- Map Title -->
        <div id="map-title" class="table-view"></div>

        <!-- Divider -->
        <hr class="divider" />

        <!-- Bottom Container -->
        <div id="map-footer"></div>
    </main>
</template>
    
<script>
// Import components
import Map from "@/components/Map.vue";
import ProjectPanel from "@/components/MainView/ProjectPanel.vue";

export default {

    name: "MultiTopicView",
    // Components of the app
    components: {
        Map,
        ProjectPanel
    },
    async mounted() {
        // Longitude and Latitute of Munich, initial state of map
        const initialState = { lng: 11.5761, lat: 48.15, zoom: 11.5 };
        const bounds = [
            [11.088, 47.866],
            [12.01, 48.41]
        ];
        this.settings = {
            style: "https://api.maptiler.com/maps/a7411f7b-1ce4-4d46-91d3-829ee4b8ec7a/style.json?key=TPvsAam5oQQKUZqCfqav",
            center: [initialState.lng, initialState.lat],
            zoom: initialState.zoom,
            minZoom: 10,
            maxZoom: 18,
            maxBounds: bounds,
            attributionControl: false,
            scrollZoom: false,
            boxZoom: false,
            dragRotate: false,
            doubleClickZoom: false,
            touchZoomRotate: false,
            touchPitch: false
        }
        this.initialMap = this.viewSetup[0];
    },
    data() {
        return {
            // List of projects that are shown inside the application
            mapController: { activeMaps: [] },
            settings: null,
            initialMap: null,
            viewSetup: [
                { title: "Öffentlicher Personennahverkehr", map: "Example/public", template: "Example/public" },
                { title: "Öffentliche Straßen", map: "Example/streets", template: "Example/streets" },
                { title: "Aktive Mobilität", map: "Example/points", template: "Example/poi" },
            ]
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
            this.mapController.setMapLimit(1);
        }
    }
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

.multi-topic-info {
    background-color: rgba(1, 73, 135, 0.7);
    color: aliceblue;
    position: fixed;
    left: 50%;
    bottom: 5vh;
    transform: translateX(-50%);
    width: fit-content;
    display: flex;
    justify-content: space-evenly;
    font-size: 20px;
    padding: 8px;
    border-radius: 4px;
}
</style>