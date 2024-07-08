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
            <button class="layer-control panel-button" layer-toggle="ComfficientShare/mobility:weekend_track;">
                Wochenende
            </button>
            <button class="layer-control panel-button" layer-toggle="ComfficientShare/mobility:weekday_track;">
                Wochentag
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

        // Add open street map source for vector tiles
        map.addSource("planet", {
            type: "vector",
            tiles: [
                "https://api.maptiler.com/tiles/v3-openmaptiles/{z}/{x}/{y}.pbf?key=TPvsAam5oQQKUZqCfqav"
            ]
        });

        map.addSource("home_location", {
            type: "geojson",
            data: "/assets/Stadtteile_mit_newproj_test_lat.geojson"
        });

        map.addSource("weekday", {
            type: "geojson",
            data: "/assets/track_CS_weekday.geojson"
        });
        map.addSource("weekend", {
            type: "geojson",
            data: "/assets/track_CS_weekend.geojson"
        });


        map.addLayer({
            id: "home",
            type: "fill",
            source: "home_location",
            paint: {
                "fill-color": "black",
                "fill-opacity": 0.5,
            },
            layout: {
                visibility: "visible",
            },
        });
        map.addLayer({
            id: "weekend_track",
            type: "line",
            source: "weekend",
            paint: {
                "line-color": "orange",
                "line-opacity": 0.8,
                "line-width": 1.8,
            },
            layout: {
                visibility: "none",
            },
        });
        map.addLayer({
            id: "weekday_track",
            type: "line",
            source: "weekday",
            paint: {
                "line-color": "green",
                "line-opacity": 0.8,
                "line-width": 1.8,
            },
            layout: {
                visibility: "none",
            },
        });

        // Add popups to display when symbols are clicked
        // function handleWeekdayPopup(e) {
        //     new maplibre.Popup().setLngLat(e.lngLat).setHTML(
        //         "<h2 style='font-weight: bold;'> Bike-Sharing Station </h2>"
        //     ).addTo(map);
        // }

        // function handleClick(e, title) {
        //     if (e.features[0].properties.Maßnahme == undefined) {
        //         new maplibre.Popup()
        //             .setLngLat(e.lngLat)
        //             .setHTML(
        //                 "<h2 style='font-weight: bold;'>" + title + "</h2>"
        //             ).addTo(map);
        //     } else {
        //         new maplibre.Popup()
        //             .setLngLat(e.lngLat)
        //             .setHTML(
        //                 "<h2 style='font-weight: bold;'>" + e.features[0].properties.Maßnahme + "</h2>"
        //                 + "<hr style='margin-top: 5px; margin-bottom: 5px'>"
        //                 + "<h3> Ort: " + e.features[0].properties.Straße + "</h3>"
        //                 + "<hr style='margin-top: 5px; margin-bottom: 5px'>"
        //                 + "<h3>" + e.features[0].properties["Nähere Beschreibung"] + "</h3>"
        //             ).addTo(map);
        //     }
        // };

        map.on("click", "weekdays", (event) => handleClick(event, "Weekday_Mobility"));
        map.on("click", "weekends", (event) => handleClick(event, "Weekend_Mobility"));
    



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
    this.map.showLayer("home");

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