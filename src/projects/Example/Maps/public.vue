<template>
    <!-- Map title -->
    <!-- A title which describes your project the best -->
    <teleport-wrapper to="#map-title" v-if="activated">
        <!-- Please always wrap your title into the div -->
        <div class="map-title">
            Public Transports Networks and Stations
        </div>
    </teleport-wrapper>
    <!-- Map info -->
    <!-- An information that describes your project the best -->
    <teleport-wrapper to="#map-info" v-if="activated">
        <!-- Please always wrap your info into the div -->
        <div class="map-info">
            Public Transports Networks and Stations
        </div>
    </teleport-wrapper>
    <!-- Map footer -->
    <!-- Footer Content, if displayed for navigation -->
    <teleport-wrapper to="#map-footer" v-if="activated">
        <!-- Please always wrap your footer into the div -->
        <div class="map-footer">
            <button class="layer-control panel-button" layer-toggle="Example/public:motorways"> Straßennetz </button>
            <button class="layer-control panel-button" layer-toggle="Example/public:railways"> Stadtbahnnetz
            </button>
            <button class="layer-control panel-button" layer-toggle="Example/public:subwaylines"> Ubahnnetz </button>
            <button class="layer-control panel-button" n-layer-hide="Example/public"
                layer-toggle="Example/public:subwaystations">
                Ubahnhaltestellen </button>
            <button class="layer-control panel-button" layer-toggle="Example/public:busstops"> Bushaltestellen
            </button>
        </div>
    </teleport-wrapper>
</template>
      
<script>
import teleportWrapper from '@/components/Generic/TeleportWrapper.vue'
import interact from 'interactjs';

export default {
    name: "pointsMap",
    props: {
        name: String,
        map: Object
    },
    components: { teleportWrapper },
    data() {
        return { activated: false };
    },
    mounted() { },
    async created() {
        const map = this.map;
        /////
        ///FROM HERE YOUR CUSTOM MAP CODE PLACES IN
        /////

        //
        // Get files from a protobuffer path

        // Add open street map source for vector tiles
        map.addSource("planet", {
            type: "vector",
            tiles: [
                "https://api.maptiler.com/tiles/v3-openmaptiles/{z}/{x}/{y}.pbf?key=TPvsAam5oQQKUZqCfqav"
            ]
        });

        // Add city district boundaries as a layer
        map.addLayer({
            id: "districts",
            type: "line",
            source: "planet",
            "source-layer": "boundary",
            paint: {
                "line-color": "black"
            },
            filter: [
                "all",
                ["in", "admin_level", 5, 6, 7, 8, 9]
            ],
        });

        // Add a layer with colored areas for city parks
        map.addLayer({
            id: "parks",
            type: "fill",
            source: "planet",
            "source-layer": "landcover",
            paint: {
                "fill-color": "rgb(77, 189, 105)",
                "fill-opacity": 0.5
            },
            filter: [
                "all",
                ["==", "subclass", "park"]
            ]
        });

        // Add layer for pedestrian only areas
        map.addLayer({
            id: "pedestrian",
            type: "fill",
            source: "planet",
            "source-layer": "transportation",
            paint: {
                "fill-color": "rgb(224, 208, 31)",
                "fill-opacity": 0.5
            },
            filter: [
                "all",
                ["==", "$type", "Polygon"],
                ["!has", "brunnel"],
                ["!in", "class", "bridge", "pier"],
                ["in", "subclass", "pedestrian"]
            ]
        });

        // Add layer to show major railways
        map.addLayer({
            id: "railways",
            type: "line",
            source: "planet",
            "source-layer": "transportation",
            paint: {
                "line-color": "red",
                "line-opacity": 0.5
            },
            filter: [
                "all",
                ["in", "class", "rail"]
            ],
            layout: {
                "visibility": "none"
            }
        });

        // Add layer to show motorways
        map.addLayer({
            id: "motorways",
            type: "line",
            source: "planet",
            "source-layer": "transportation",
            paint: {
                "line-color": "blue",
                "line-opacity": 0.8,
                "line-width": 4
            },
            filter: [
                "all",
                ["in", "class", "motorway"]
            ],
            layout: {
                visibility: "none"
            }
        })

        // 
        // Get files from GeoJson

        // GeoJSON source for bus stops
        map.addSource("busstops", {
            type: "geojson",
            data: "/assets/busstops.geojson",
        });

        // GeoJSON source for subway stops
        map.addSource("subwaystations", {
            type: "geojson",
            data: "/assets/subwaystations.geojson",
        });

        // GeoJSON source for subway stops
        map.addSource("subwaylines", {
            type: "geojson",
            data: "/assets/subways.geojson",
        });

        // Layer configuration for bus stops
        map.addLayer({
            id: "busstops",
            type: "circle",
            source: "busstops",
            layout: {
                visibility: "none"
            },
            paint: {
                "circle-color": "rgb(162,173,0)",
                "circle-opacity": 0.8,
                "circle-stroke-color": "white",
                "circle-stroke-width": 1,
                "circle-radius": {
                    property: "energy",
                    type: "exponential",
                    stops: [
                        [0, 5],
                        [10000, 5]
                    ]
                }
            }
        });

        // Layer configuration for subway stops
        map.addLayer({
            id: "subwaystations",
            type: "circle",
            source: "subwaystations",
            layout: {
                visibility: "none"
            },
            paint: {
                "circle-color": "rgb(20,173,162)",
                "circle-opacity": 0.8,
                "circle-stroke-color": "white",
                "circle-stroke-width": 1,
                "circle-radius": {
                    property: "energy",
                    type: "exponential",
                    stops: [
                        [0, 5],
                        [10000, 5]
                    ]
                }
            }
        });

        // Layer configuration for subway stops
        map.addLayer({
            id: "subwaylines",
            type: "line",
            source: "subwaylines",
            layout: {
                visibility: "none"
            },
            paint: {
                "line-color": "orange",
                "line-opacity": 0.5,
                "line-width": 4
            },
        });

        /////
        ///END OF YOUR CODE PLEASE KEEP THE REST
        /////
        this.activated = true;
    },
    async activated() {
        /////
        ///DEFINE WHICH MAPS WILL BE SHOWN INITIALLY
        /////

        //HIDE ALL LAYERS AT THE BEGINNING
        this.map.hideMapLayers();

        //SHOW SPECIFIC LAYERS
        // this.map.showLayer("busstops");

        //SHOW ALL LAYERS AT THE BEGINNING
        // this.map.showMapLayers();

        //HIDE SPECIFIC LAYERS
        // this.map.hideLayer("busstops");

        /////
        ///END OF YOUR CODE PLEASE KEEP THE REST
        /////
        this.activated = true;
    },
    async deactivated() {
        /////
        ///DEFINE WHAT HAPPENS ON SWITCHING TO ANOTHER PROJECT, DEFAULTLY KEEP THIS
        /////

        this.map.hideMapLayers();

        /////
        ///END OF YOUR CODE PLEASE KEEP THE REST
        /////
        this.activated = false;
    },
    methods: {
    },
    computed: {
    }
};

</script>
      
      
<style></style>