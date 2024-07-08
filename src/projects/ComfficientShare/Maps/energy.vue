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
</template>


<script>
import teleportWrapper from '@/components/Generic/TeleportWrapper.vue';
import maplibre from 'maplibre-gl';
//import interact from 'interactjs'; //usable if necessary
import Chart from 'chart.js/auto';

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

        map.addSource("planet", {
            type: "vector",
            tiles: [
                "https://api.maptiler.com/tiles/v3-openmaptiles/{z}/{x}/{y}.pbf?key=TPvsAam5oQQKUZqCfqav"
            ]
        });

        map.addSource("energy_data", {
            type: "geojson",
            data: "/assets/Stadtteile_mit_energieverbrauch_heatmap_blau_rot.geojson",
        });

        map.addLayer({
            id: "heatmap-layer",
            type: "fill",
            source: "energy_data",
            paint: {
                "fill-color": ["get", "heatmapcolor"],
                "fill-opacity": 0.7,
            },
            layout: {
                visibility: "visible",
            },
        });

        function handleEnergyPopup(e) {
            const properties = e.features[0].properties;

            const chart1 = 'chart-' + properties["NAME_STAT_"];

            new maplibre.Popup().setLngLat(e.lngLat).setHTML(
                `<div>
                    <h2 style='font-weight: bold;'>${properties["NAME_STAT_"]}</h2>
                    <hr style='margin-top: 5px; margin-bottom: 5px'>
                    <h3>Anwohner: ${properties["Total_peop"]}</h3>
                    <h3>Anwohner pro km<sup>2</sup>: ${properties["People_per_sqkm"]}</h3>
                    <h3>PKW Anzahl: ${properties["Total_cars"]}</h3>
                    <h3>Energieverbrauch mit 100% BEV: ${properties["Total_electricity_all_BEV_MWh"]} MWh</h3>
                    <canvas id="${chart1}" width="400" height="200"></canvas>
                </div>`
            ).addTo(map);

            // Wait for the popup to be fully added to the DOM
            setTimeout(() => {
                const ctx = document.getElementById(chart1).getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['20%', '50%', '90%'],
                        datasets: [{
                            label: 'Reduction in Car-sharing',
                            data: [
                                properties["If_carsharing_reduces_20"],
                                properties["If_carsharing_reduces_50"],
                                properties["If_carsharing_reduces_90"]
                            ],
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                            fill: false,
                            tension: 0.1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }, 0);
        }

        map.on("click", "home", handleEnergyPopup);
        map.on("click", "heatmap-layer", handleEnergyPopup);

        map.on("click", "test_1", (event) => handleClick(event, "Weekday_Mobility"));
        map.on("click", "test_2", (event) => handleClick(event, "Weekend_Mobility"));

        this.activated = true;
    },
    async activated() {
        this.map.showLayer("heatmap-layer");
        this.activated = true;
    },
    async deactivated() {
        this.map.hideMapLayers();
        this.activated = false;
    },
    methods: {},
    computed: {}
};
</script>

<style></style>
