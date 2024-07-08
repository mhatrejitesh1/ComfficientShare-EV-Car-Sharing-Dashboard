<template>
    <!-- Map title -->
    <teleport-wrapper to="#map-title" v-if="activated">
        <!-- Please always wrap your title into the div -->
        <div class="map-title">
            Straßen, Fahrradwege und Fußgängerzonen
        </div>
    </teleport-wrapper>
    <!-- Map info -->
    <teleport-wrapper to="#map-info" v-if="activated">
        <!-- Please always wrap your info into the div -->
        <div class="map-info">
            <font-awesome-icon :icon="['fas', 'circle-info']" height="40" width="40" />
            <p> Für weitere Informationen einzelne Bereiche antippen </p>
        </div>
    </teleport-wrapper>
    <!-- Map footer -->
    <teleport-wrapper to="#map-footer" v-if="activated">
        <!-- Please always wrap your footer into the div -->
        <div class="map-footer">
            <p> Footer Content </p>
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
        map.addSource("pbf", {
            type: "vector",
            tiles: [
                "https://datsimiaa.ftm.ed.tum.de/api/tiles/maps/osm/{z}/{x}/{y}.pbf"
            ],
        });
        // Major car streets
        map.addLayer({
            id: "cars",
            type: "line",
            source: "pbf",
            "source-layer": "car_streets",
            paint: {
                "line-color": "rgba(66, 36, 140, 0.7)",
                "line-width": ["interpolate", ["linear"], ["zoom"], 11, 2, 18, 4]
            }
        });
        // Bike streets
        map.addLayer({
            id: "bikes",
            type: "line",
            source: "pbf",
            "source-layer": "bike_streets",
            paint: {
                "line-color": "rgba(103, 199, 91, 0.7)",
                "line-width": ["interpolate", ["linear"], ["zoom"], 11, 2, 18, 3]
            }
        });
        // Pedestrian zones
        map.addLayer({
            id: "pedestrian",
            type: "fill",
            source: "pbf",
            "source-layer": "pedestrian_zone",
            paint: {
                "fill-color": "rgba(227, 235, 124, 0.7)",
            }
        });

        // Show elements
        this.activated = true;
    },
    async activated() {
        // Keep this
        this.map.showMapLayers();
        this.activated = true;
        // Your code comes next
    },
    async deactivated() {
        // Keep this
        this.map.hideMapLayers();
        this.activated = false;
        // Your code comes next
    },
    methods: {
    },
    computed: {
    }
};

</script>
      
      
<style></style>