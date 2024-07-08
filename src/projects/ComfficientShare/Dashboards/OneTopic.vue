<template>
    <main v-if="view != null">

        <!-- Panels -->
        <div class="container">
            <div class="rotate-left">
                <PanelContainer :project="view.title" :file="view.template" :idName="'left-frame'" :top="false"
                    :key="view" />
            </div>
            <div class="rotate-right">
                <PanelContainer :project="view.title" :file="view.template" :idName="'right-frame'" :top="false"
                    :key="view" />
            </div>
        </div>
        <div class="rotate-top">
            <PanelContainer :project="view.title" :file="view.template" :idName="'top-frame'" :top="true" :key="view" />
        </div>

        <!-- Map -->
        <Map :map="view.map" :settings="this.settings" v-on:map-controler-init="mapControllerInit" />

        <!-- One Topic Zoom Controls -->
        <div class="top-zoom">
            <ZoomControl />
        </div>

        <!-- Map Info -->
        <div id="map-info"> </div>

        <!-- Divider -->
        <hr class="divider" />

        <!-- Bottom Container -->
        <div class="list-container">
            <li v-for="project in viewSetup">
                <ProjectButton @clickedButton="changeView" :index="viewSetup.indexOf(project).toString()"
                    :name=project.title :isClicked="view == project" />
            </li>
        </div>
    </main>
</template>
    
<script>
// Import components
import Map from "@/components/Map.vue";
import PanelContainer from "@/components/MainView/PanelContainer.vue";
import ZoomControl from "@/components/MainView/ZoomControl.vue";
import ProjectButton from "@/components/MainView/ProjectButton.vue";

export default {

    name: "OneTopicView",
    // Components of the app
    components: {
        Map,
        PanelContainer,
        ZoomControl,
        ProjectButton
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
        this.view = this.viewSetup[0];
    },
    data() {
        return {
            // List of projects that are shown inside the application
            mapController: { activeMaps: [] },
            settings: null,
            view: null,
            viewSetup: [
                { title: "Öffentlicher Personennahverkehr", map: "Example/public", template: "Example/public" },
                { title: "Mobilität", map: "ComfficientShare/mobility", template: "ComfficientShare/mobility" },
                { title: "Ladeinfrastruktur", map: "ComfficientShare/lis", template: "ComfficientShare/lis" },
				{ title: "Energy", map: "ComfficientShare/energy", template: "ComfficientShare/energy" },
                { title: "Power Infrastructure", map: "ComfficientShare/powinf", template: "ComfficientShare/powinf" },
            ]
        }
    },
    methods: {
        // Used for project buttons to change the value of the selected project
        changeView(index) {
            for (let i = 0; i < this.viewSetup.length; i++) {
                if (i == index) {
                    this.mapController.toggleMap(this.viewSetup[i].map);
                    this.view = this.viewSetup[index];
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

.top-zoom {
    width: 60vw;
    height: fit-content;
    position: fixed;
    left: 50%;
    top: 1vh;
    transform: translateX(-50%) rotate(180deg);
    display: flex;
    justify-content: space-between;
}

.rotate-top {
    transform: translateX(-50%) rotate(180deg);
    z-index: 5;
    position: fixed;
    top: 0;
    left: 50%;
}

.rotate-left {
    position: absolute;
    left: -6.3%;
    top: 50%;
    z-index: 5;
    -moz-transform: translateY(-50%) rotate(90deg);
    -webkit-transform: translateY(-50%) rotate(90deg);
    transform: translateY(-50%) rotate(90deg);
}

.rotate-right {
    position: absolute;
    right: -6.3%;
    top: 50%;
    z-index: 5;
    -moz-transform: translateY(-50%) rotate(-90deg);
    -webkit-transform: translateY(-50%) rotate(-90deg);
    transform: translateY(-50%) rotate(-90deg);
}

.list-container {
    display: table;
    text-align: center;
    margin: 0;
    padding: 0;
    width: 100%;
    position: fixed;
    bottom: 4vh;
}

.list-container li {
    display: table-cell;
    vertical-align: top;
}
</style>