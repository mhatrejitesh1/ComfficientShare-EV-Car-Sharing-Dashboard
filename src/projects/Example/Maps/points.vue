<template>
    <!-- Map title -->
    <!-- A title which describes your project the best -->
    <teleport-wrapper to="#map-title" v-if="activated">
        <!-- Please always wrap your title into the div -->
        <div class="map-title">
            Active Mobility Offers
        </div>
    </teleport-wrapper>
    <!-- Map info -->
    <!-- An information that describes your project the best -->
    <teleport-wrapper to="#map-info" v-if="activated">
        <!-- Please always wrap your info into the div -->
        <div class="map-info">
            Active Mobility Offers
        </div>
    </teleport-wrapper>
    <!-- Map footer -->
    <!-- Footer Content, if displayed for navigation -->
    <teleport-wrapper to="#map-footer" v-if="activated">
        <!-- Please always wrap your footer into the div -->
        <div class="map-footer">
            <button class="layer-control panel-button"
                layer-toggle="Example/points:bikesharing;Example/points:bikesharing-points">
                Bike-Sharing
            </button>
            <button class="layer-control panel-button"
                layer-toggle="Example/points:bikelanes;Example/points:bikelanes-points">
                Radfahrstreifen
            </button>
            <button class="layer-control panel-button"
                layer-toggle="Example/points:mobility;Example/points:mobility-points">
                Mobilitätsstationen
            </button>
            <button class="layer-control panel-button"
                layer-toggle="Example/points:parklets;Example/points:parklets-points">
                Parklets
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

        //Bike lanes
        map.addSource("pbf", {
            type: "vector",
            tiles: [
                "https://datsimiaa.ftm.ed.tum.de/api/tiles/maps/osm/{z}/{x}/{y}.pbf"
            ],
        });
        map.addSource("bikelanes", {
            type: "geojson",
            data: "/assets/bike_lanes.geojson",
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 20
        });
        // Mobility Stations
        map.addSource("mobility", {
            type: "geojson",
            data: "/assets/mobility_stations.geojson",
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 20
        });
        // Parklets
        map.addSource("parklets", {
            type: "geojson",
            data: "/assets/parklets.geojson",
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 20
        });
        const images = [{ url: '/assets/bicycle_icon.png', id: 'bicycle_icon' }, { url: '/assets/garden_icon.png', id: 'garden_icon' }, { url: '/assets/electric_icon.png', id: 'electric_icon' }]
        await Promise.all(
            images.map(img => new Promise((resolve, reject) => {
                map.loadImage(img.url, function (error, res) {
                    if (error) throw error;
                    map.addImage(img.id, res)
                    resolve();
                })
            }))
        ).then(() => {
            // Bike-Sharing stations
            map.addLayer({
                id: "bikesharing-points",
                type: "circle",
                source: "pbf",
                "source-layer": "bikesharing_stations",
                layout: {
                    "visibility": "visible"
                },
                paint: {
                    "circle-color": "rgba(252, 126, 129, 0.7)",
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "white",
                    "circle-radius": ["interpolate", ["linear"], ["zoom"], 11, 14, 18, 50]
                }
            });
            map.addLayer({
                id: "bikesharing",
                type: "symbol",
                source: "pbf",
                "source-layer": "bikesharing_stations",
                layout: {
                    "visibility": "visible",
                    "icon-image": "bicycle_icon",
                    "icon-size": ["interpolate", ["linear"], ["zoom"], 11, 0.04, 18, 0.15]
                }
            });
            map.addLayer({
                id: "bikelanes-points",
                type: "circle",
                source: "bikelanes",
                layout: {
                    "visibility": "visible"
                },
                paint: {
                    "circle-color": "rgba(169, 136, 235, 0.7)",
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "white",
                    "circle-radius": ["interpolate", ["linear"], ["zoom"], 11, 14, 18, 50]
                }
            });
            map.addLayer({
                id: "bikelanes",
                type: "symbol",
                source: "bikelanes",
                layout: {
                    "visibility": "visible",
                    "icon-image": "bicycle_icon",
                    "icon-size": ["interpolate", ["linear"], ["zoom"], 11, 0.04, 18, 0.15]
                }
            });
            // Parklets
            map.addLayer({
                id: "parklets-points",
                type: "circle",
                source: "parklets",
                layout: {
                    "visibility": "visible"
                },
                paint: {
                    "circle-color": "rgba(123, 207, 114, 0.7)",
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "white",
                    "circle-radius": ["interpolate", ["linear"], ["zoom"], 11, 14, 18, 50]
                }
            });
            map.addLayer({
                id: "parklets",
                type: "symbol",
                source: "parklets",
                layout: {
                    "visibility": "visible",
                    "icon-image": "garden_icon",
                    "icon-size": ["interpolate", ["linear"], ["zoom"], 11, 0.04, 18, 0.15]
                }
            });
            // Mobility Points
            map.addLayer({
                id: "mobility-points",
                type: "circle",
                source: "mobility",
                layout: {
                    "visibility": "visible"
                },
                paint: {
                    "circle-color": "rgba(125, 227, 220, 0.7)",
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "white",
                    "circle-radius": ["interpolate", ["linear"], ["zoom"], 11, 14, 18, 50]
                }
            })
            map.addLayer({
                id: "mobility",
                type: "symbol",
                source: "mobility",
                layout: {
                    "visibility": "visible",
                    "icon-image": "electric_icon",
                    "icon-size": ["interpolate", ["linear"], ["zoom"], 11, 0.04, 18, 0.15]
                }
            });
            // Add popups to display when symbols are clicked
            function handleBikePopup(e) {
                new maplibre.Popup().setLngLat(e.lngLat).setHTML(
                    "<h2 style='font-weight: bold;'> Bike-Sharing Station </h2>"
                ).addTo(map);
            }

            function handleClick(e, title) {
                if (e.features[0].properties.Maßnahme == undefined) {
                    new maplibre.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(
                            "<h2 style='font-weight: bold;'>" + title + "</h2>"
                        ).addTo(map);
                } else {
                    new maplibre.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(
                            "<h2 style='font-weight: bold;'>" + e.features[0].properties.Maßnahme + "</h2>"
                            + "<hr style='margin-top: 5px; margin-bottom: 5px'>"
                            + "<h3> Ort: " + e.features[0].properties.Straße + "</h3>"
                            + "<hr style='margin-top: 5px; margin-bottom: 5px'>"
                            + "<h3>" + e.features[0].properties["Nähere Beschreibung"] + "</h3>"
                        ).addTo(map);
                }
            }

            map.on("click", "bikesharing", handleBikePopup);
            map.on("click", "bikesharing-points", handleBikePopup);

            map.on("click", "bikelanes", (event) => handleClick(event, "Pop-Up-Radfahrstreifen"));
            map.on("click", "bikelanes-points", (event) => handleClick(event, "Pop-Up-Radfahrstreifen"));

            map.on("click", "parklets", (event) => handleClick(event, "Parklet"));
            map.on("click", "parklets-points", (event) => handleClick(event, "Parklet"));

            map.on("click", "mobility", (event) => handleClick(event, "Mobilitätsstation"));
            map.on("click", "mobility-points", (event) => handleClick(event, "Mobilitätsstation"));
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