<template>
    <!-- Map title -->
    <!-- A title which describes your project the best -->
    <teleport-wrapper to="#map-title" v-if="activated">
        <!-- Please always wrap your title into the div -->
        <div class="map-title">
            ComfficientShare
        </div>
    </teleport-wrapper>
    <!-- Map info -->
    <!-- An information that describes your project the best -->
    <teleport-wrapper to="#map-info" v-if="activated">
        <!-- Please always wrap your info into the div -->
        <div class="map-info">
            ComfficientShare
        </div>
    </teleport-wrapper>
    <!-- Map footer -->
    <!-- Footer Content, if displayed for navigation -->
    <teleport-wrapper to="#map-footer" v-if="activated">
        <!-- Please always wrap your footer into the div -->
        <div class="map-footer">
            <button class="layer-control panel-button"
                layer-toggle="ComfficientShare/lis:lis-ac-circle;ComfficientShare/lis:lis-ac-symbol;ComfficientShare/lis:lis-dc-circle;ComfficientShare/lis:lis-dc-symbol">
                Ladeinfrastruktur
            </button>
            <button class="layer-control panel-button"
                layer-toggle="ComfficientShare/lis:pv_potential">
                PV-Potenzial
            </button>
        </div>
    </teleport-wrapper>
</template>
      
<script>
import teleportWrapper from '@/components/Generic/TeleportWrapper.vue'
import maplibre from 'maplibre-gl';
import interact from 'interactjs';

export default {
    name: "pointsMap",
    props: {
        name: String,
        map: Object
    },
    components: { teleportWrapper },
    data() {
        return { activated: false, initState: 0 };
    },
    mounted() { },
    async created() {
        const map = this.map;
        /////
        ///FROM HERE YOUR CUSTOM MAP CODE PLACES IN
        /////

        //
        // Get files from a protobuffer path

        // Load map
        map.addSource("pbf", {
            type: "vector",
            tiles: [
                "https://datsimiaa.ftm.ed.tum.de/api/tiles/maps/osm/{z}/{x}/{y}.pbf"
            ],
        });
        //Ladeinfrastruktur
        map.addSource("LIS_AC_src", {
            type: "geojson",
            data: "/assets/LIS_AC.geojson",
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 20
        });
        map.addSource("LIS_DC_src", {
            type: "geojson",
            data: "/assets/LIS_DC.geojson",
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 20
        });
        // PV-Potenzial
        map.addSource("PV_src", {
            type: "geojson",
            data: "/assets/cs_home.geojson",
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 20
        });
        const images = [{ url: '/assets/HouseIcon.png', id: 'house_icon' }, { url: '/assets/electric_icon.png', id: 'electric_icon' }]
        await Promise.all(
            images.map(img => new Promise((resolve, reject) => {
                map.loadImage(img.url, function (error, res) {
                    if (error) throw error;
                    map.addImage(img.id, res)
                    resolve();
                })
            }))
        ).then(() => {
            // Ladeinfrastruktur AC
            map.addLayer({
                id: "lis-ac-circle",
                type: "circle",
                source: "LIS_AC_src",
                layout: {
                    "visibility": "visible"
                },
                paint: {
                    "circle-color": "rgba(30, 126, 226, 0.9)",
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "white",
                    "circle-radius": ["interpolate", ["linear"], ["zoom"], 11, 14, 18, 20]
                }
            });
            map.addLayer({
                id: "lis-ac-symbol",
                type: "symbol",
                source: "LIS_AC_src",
                layout: {
                    "visibility": "visible",
                    "icon-image": "electric_icon",
                    "icon-size": ["interpolate", ["linear"], ["zoom"], 11, 0.04, 18, 0.05]
                }
            });
            // Ladeinfrastruktur DC
            map.addLayer({
                id: "lis-dc-circle",
                type: "circle",
                source: "LIS_DC_src",
                layout: {
                    "visibility": "visible"
                },
                paint: {
                    "circle-color": "rgba(30, 236, 24, 0.9)",
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "white",
                    "circle-radius": ["interpolate", ["linear"], ["zoom"], 11, 14, 18, 20]
                }
            });
            // PV-Potenzial
            map.addLayer({
                id: "pv_potential",
                type: "fill",
                source: "PV_src",
                layout: {
                    "visibility": "visible"
                },
                paint: {
                    "fill-color": "black",
                    "fill-opacity": 0.5,
                }
            });
            // Add popups to display when symbols are clicked
            function handleLisPopup(e) {
                new maplibre.Popup().setLngLat(e.lngLat).setHTML(
                    "<h2 style='font-weight: bold;'> Ladestation </h2>"
                    + "<hr style='margin-top: 5px; margin-bottom: 5px'>"
                    + "<h3> " + e.features[0].properties["Typ"] + "</h3>"
                    + "<hr style='margin-top: 5px; margin-bottom: 5px'>"
                    + "<h3> Nennleistung: " + e.features[0].properties["Leistung"] + " kW</h3>"
                    + "<h3> Anzahl Ladepunkte: " + e.features[0].properties["Ladepunkte"] + "</h3>"
                    + "<h3> Inbetriebnahmedatum: " + e.features[0].properties["Datum"] + "</h3>"
                ).addTo(map);
            }

            map.on("click", "lis-ac-circle", handleLisPopup);
            //map.on("click", "lis-ac-symbol", handleLisPopup);
            map.on("click", "lis-dc-circle", handleLisPopup);
            //map.on("click", "lis-dc-symbol", handleLisPopup);
        })



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
        //this.map.hideMapLayers();

        //SHOW SPECIFIC LAYERS
        // this.map.showLayer("busstops");

        //SHOW ALL LAYERS AT THE BEGINNING
        this.map.showMapLayers();
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