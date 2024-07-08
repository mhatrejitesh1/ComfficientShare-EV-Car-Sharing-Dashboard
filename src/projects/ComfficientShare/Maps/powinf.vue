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
            <button class="layer-control panel-button" layer-toggle="ComfficientShare/powinf:pylovo_lines_layer;">
                Low Voltage Grid
            </button>
        </div>
    </teleport-wrapper>

    <teleport-wrapper to="#map-footer" v-if="activated">
        <!-- Please always wrap your footer into the div -->
        <div class="map-footer">
            <button class="layer-control panel-button2" layer-toggle= "ComfficientShare/powinf:pylovo_trans_pos_layer;ComfficientShare/powinf:trans_pos_symbol" >
                Transformer Positions
            </button>
        </div>
    </teleport-wrapper>
</template>
      
<script>
import teleportWrapper from '@/components/Generic/TeleportWrapper.vue'
import maplibre from 'maplibre-gl';
//import interact from 'interactjs'; //usable if necessary

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

        // Add open street map source for vector tiles
        map.addSource("planet", {
            type: "vector",
            tiles: [
                "https://api.maptiler.com/tiles/v3-openmaptiles/{z}/{x}/{y}.pbf?key=TPvsAam5oQQKUZqCfqav"
            ]
        });

        map.addSource("energy_data", {
    type: "geojson",
    data: "/assets/open_infra_map_overpass_wcables.geojson",
    });

    map.addSource("pylovo_data1", {
    type: "geojson",
    data: "/assets/muc_grid_pylovo_lines.geojson",
    });

    map.addSource("pylovo_data2", {
    type: "geojson",
    data: "/assets/muc_grid_pylovo_trans_pos.geojson",
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 20
    });

    const images = [{ url: '/assets/trans_icon.png', id: 'trans_icon' }]
        await Promise.all(
            images.map(img => new Promise((resolve, reject) => {
                map.loadImage(img.url, function (error, res) {
                    if (error) throw error;
                    map.addImage(img.id, res)
                    resolve();
                })
            }))
        ).then(() => {

    // Add a layer for polygons and multipolygons
    map.addLayer({
    id: "polygon-layer",
    type: "fill",
    source: "energy_data",
    paint: {
        "fill-color": "yellow", // Set polygons and multipolygons to yellow
        "fill-opacity": 0.7,
    },
    layout: {
        visibility: "visible",
    },
    filter: ["==", "$type", "Polygon"] // Filter to only include Polygon and MultiPolygon features
    });

    // Add a layer for lines
    map.addLayer({
        id: "line-layer",
    type: "line",
    source: "energy_data",
    paint: {
        "line-color": [
            "case",
            ["all", [">=", ["to-number", ["get", "voltage"]], 0], ["<", ["to-number", ["get", "voltage"]], 50000]], "green",
            ["all", [">=", ["to-number", ["get", "voltage"]], 50000], ["<", ["to-number", ["get", "voltage"]], 100000]], "yellow",
            ["all", [">=", ["to-number", ["get", "voltage"]], 100000], ["<", ["to-number", ["get", "voltage"]], 200000]], "orange",
            ["all", [">=", ["to-number", ["get", "voltage"]], 200000], ["<", ["to-number", ["get", "voltage"]], 900000]], "red",
            "purple"
        ],
        "line-width": 2,
    },
    layout: {
        visibility: "visible",
    },
    filter: ["all", ["==", "$type", "LineString"], ["!=", "power", "cable"]], // Filter to only include LineString features
    });

    // Add a layer for cables
    map.addLayer({
    id: "cable-layer",
    type: "line",
    source: "energy_data",
    paint: {
        "line-color": "blue", // Choose your preferred color for cables
        "line-width": 2,
    },
    layout: {
        visibility: "visible",
    },
    filter: ["all", ["==", "$type", "LineString"], ["==", "power", "cable"]], // Filter to only include LineString features
    });

    // Add a layer for points
    map.addLayer({
    id: "point-layer",
    type: "circle",
    source: "energy_data",
    paint: {
        "circle-radius": 3,
        "circle-color": "red", // Choose your preferred color for points
    },
    layout: {
        visibility: "visible",
    },
    filter: ["==", "$type", "Point"], // Filter to only include Point features
    });

    // Layer for pylovo_data1
map.addLayer({
    id: "pylovo_lines_layer",
    type: "line",
    source: "pylovo_data1",
    paint: {
        "line-color": "green",
        "line-width": 2,
    },
    layout: {
        visibility: "none",
    },
});

// Layer for pylovo_data3
map.addLayer({
    id: "pylovo_trans_pos_layer",
    type: "circle",
    source: "pylovo_data2",
    paint: {
                    "circle-color": "rgba(30, 126, 226, 0.9)",
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "white",
                    "circle-radius": ["interpolate", ["linear"], ["zoom"], 11, 14, 18, 20]
            },
    layout: {
        visibility: "none",
    }
});

// Layer for the symbol
map.addLayer({
                id: "trans_pos_symbol",
                type: "symbol",
                source: "pylovo_data2",
                layout: {
                    "visibility": "none",
                    "icon-image": "trans_icon",
                    "icon-size": ["interpolate", ["linear"], ["zoom"], 11, 0.08, 18, 0.1]
                }
            });
			

        function polygonsPopup(e) {
                new maplibre.Popup().setLngLat(e.lngLat).setHTML(
                    "<h2 style='font-weight: bold;'>"  + e.features[0].properties["name"] + " </h2>"
                    + "<hr style='margin-top: 5px; margin-bottom: 5px'>"
					+ "<h3> Operator: " + e.features[0].properties["operator"] + "</h3>"
                    + "<h3> Type: " + e.features[0].properties["power"] + "</h3>"
					+ "<h3> @id: " + e.features[0].properties["@id"] + " </h3>"
					).addTo(map);
        }

        function lineInfoPopup(e) {
                new maplibre.Popup().setLngLat(e.lngLat).setHTML(
                    "<h2 style='font-weight: bold;'>"  + e.features[0].properties["name"] + " </h2>"
                    + "<hr style='margin-top: 5px; margin-bottom: 5px'>"
					+ "<h3> Operator: " + e.features[0].properties["operator"] + "</h3>"
                    + "<h3> Type: " + e.features[0].properties["power"] + "</h3>"
					+ "<h3> Voltage: " + e.features[0].properties["voltage"] / 1000 + " kV</h3>"
					).addTo(map);
        }

        function pointsPopup(e) {
                new maplibre.Popup().setLngLat(e.lngLat).setHTML(
                    "<h2 style='font-weight: bold;'>"  + e.features[0].properties["@id"] + " </h2>"
                    + "<hr style='margin-top: 5px; margin-bottom: 5px'>"
					+ "<h3> Operator: " + e.features[0].properties["operator"] + "</h3>"
                    + "<h3> Type: " + e.features[0].properties["power"] + "</h3>"

					).addTo(map);
		
        }

		map.on("click", "polygon-layer", polygonsPopup);  //We can change and give different pop-ups to different layers
        map.on("click", "point-layer", pointsPopup);
        map.on("click", "cable-layer", lineInfoPopup);
        map.on("click", "line-layer", lineInfoPopup);

        /////
        ///END OF YOUR CODE PLEASE KEEP THE REST
        /////
        this.activated = true;
        })
    },
    async activated() {
    /////
    ///DEFINE WHICH MAPS WILL BE SHOWN INITIALLY
    /////

    //HIDE ALL LAYERS AT THE BEGINNING
    //this.map.hideMapLayers();

    //SHOW SPECIFIC LAYERS
    //this.map.showLayer("home");

	this.map.showLayer("polygon-layer");
    this.map.showLayer("line-layer");
    this.map.showLayer("point-layer");
    this.map.showLayer("cable-layer");
    //this.map.showLayer("pylovo_lines_layer");
    //this.map.showLayer("pylovo_trans_pos_layer");
    //this.map.showLayer("trans_pos_symbol");


    //SHOW ALL LAYERS AT THE BEGINNING
    //this.map.showMapLayers();
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