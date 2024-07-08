<template>
    <div v-html="html"></div>
</template>

<script>
import axios from 'axios'
import { defineAsyncComponent, onMounted } from 'vue';

const regexPattern = /\/src\/projects\/([^\/]+)\/Panels\/([^\/]+)\.html/i;
const replacementString = "$1/$2";

const panels = import.meta.glob('@/projects/**/Panels/*.html', { 'as': 'raw' })
const lcKeys = Object.keys(panels).reduce(
    function (keys, k) {
        keys[k.replace(regexPattern, replacementString).toLowerCase()] = k;
        return keys
    }, {});

function getPanel(key) { return panels[lcKeys[key.toLowerCase()]] }

export default {
    props: ['template'],
    async mounted() {
        this.html = await getPanel(this.template)();
    },
    data: function () {
        return {
            html: ""
        }
    }
}
</script>

<style></style>