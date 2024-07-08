<template>
    <main v-if="settings != null">
        <!-- Map -->
        <Map view="panel" :map="map" :settings="settings" v-on:map-controler-init="mapControllerInit" />

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
        map: String
    },
    async mounted() {
        const initialState = { lng: 11.5761, lat: 48.15, zoom: 11.5 };
        this.settings = {
            style: "https://api.maptiler.com/maps/a7411f7b-1ce4-4d46-91d3-829ee4b8ec7a/style.json?key=TPvsAam5oQQKUZqCfqav",
            center: [initialState.lng, initialState.lat],
            zoom: initialState.zoom,
            minZoom: 2,
            maxZoom: 20,
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
            settings: null
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
        }
    },
    computed: {}
}
</script>
    
<style>
@import "maplibre-gl/dist/maplibre-gl.css";

.table-view {
    width: 100%;
    position: absolute;
    bottom: 5vh;
    display: flex;
    justify-content: space-evenly;
}
</style>