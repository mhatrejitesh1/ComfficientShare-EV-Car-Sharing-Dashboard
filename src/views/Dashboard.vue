<template>
    <component v-if="this.comp" :is="comp"></component>
</template>

<script>
import axios from 'axios'
import { defineAsyncComponent, onMounted } from 'vue';

const regexPattern = /\/src\/projects\/([^\/]+)\/Dashboards\/([^\/]+)\.vue/i;
const replacementString = "$1/$2";

const maps = import.meta.glob('@/projects/**/Dashboards/*.vue', {})
const lcKeys = Object.keys(maps).reduce(
    function (keys, k) {
        keys[k.replace(regexPattern, replacementString).toLowerCase()] = k;
        return keys
    }, {});
function getDash(key) { return maps[lcKeys[key.toLowerCase()]] };

export default {
    props: ['dashboard'],
    async mounted() {
        this.comp = defineAsyncComponent(getDash(this.dashboard.toLowerCase()).bind(this));
    },
    data: function () {
        return {
            comp: null
        }
    }
}
</script>

<style></style>