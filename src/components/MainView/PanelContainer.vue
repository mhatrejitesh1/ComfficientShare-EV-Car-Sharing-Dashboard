<template>
    <div :class="[top ? topContainer : sideContainer]">
        <div :class="[top ? topHeader : sideHeader]"> {{ project }} </div>
        <div :class="[top ? topInfo : sideInfo, 'interact-scrollable']" :id="idName">
            <div v-html="html"></div>
        </div>
    </div>
</template>

<script>

import interact from 'interactjs';

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
    name: "PanelContainer",
    props: {
        top: Boolean,
        idName: String,
        project: String,
        file: String,
    },
    data() {
        return {
            // Names of the corresponding css style classes
            topContainer: "container-top",
            sideContainer: "container-side",
            topHeader: "header-top",
            sideHeader: "header-side",
            topInfo: "info-frame-top",
            sideInfo: "info-frame-side",
            // Initialize the id and template of the specific information container
            id: this.idName,
            template: this.file,
            html: ""
        }
    },
    async mounted() {
        this.html = await getPanel(this.template)();
        let element = document.getElementById(this.id);
        this.initInteract(element);
    },
    methods: {
        initInteract() {
            interact.pointerMoveTolerance(2)
            const interactable = interact(".interact-scrollable")
            interactable.draggable({
                autoScroll: false,
                inertia: true,
                listeners: {
                    start: this.dragStartHandler,
                    move: this.dragMoveHandler,
                    end: this.dragMoveHandler
                }
            });
            interactable
                .on('dragmove dragend', this.dragMoveHandler)
                .gesturable({
                    enabled: true
                })
                .on('gesture', {
                    start: this.dragStartHandler,
                    move: this.dragMoveHandler,
                    end: this.dragMoveHandler
                })
        },
        dragStartHandler(e) {
            const node = e.target;
            if (node.id == "left-frame" || node.id == "right-frame") {
                node.interact_pos = {
                    left: node.scrollLeft,
                    top: node.scrollTop,
                    x: e.clientX,
                    y: e.clientY,
                };
            } else if (node.id == "top-frame") {
                node.interact_pos = {
                    left: node.scrollLeft,
                    top: node.scrollTop,
                    x: e.clientX,
                    y: e.clientY,
                }
            }
        },
        dragMoveHandler(e) {
            const node = e.target;
            const dx = e.delta.x / 3;
            const dy = e.delta.y / 3;
            if (node.id == "left-frame") {
                node.scrollLeft = node.scrollLeft + dy;
                node.scrollTop = node.scrollTop + dx;
            } else if (node.id == "right-frame") {
                node.scrollLeft = node.scrollLeft - dy;
                node.scrollTop = node.scrollTop - dx;
            } else if (node.id == "top-frame") {
                node.scrollTop = node.scrollTop + dy;
                node.scrollLeft = node.scrollLeft + dx;
            }
        }
    }
}
</script>

<style scoped>
.container-side {
    background-color: aliceblue;
    height: 20vw;
    width: 60vh;
    box-shadow: 0 -10px 15px 0 rgba(0, 0, 0, 0.6);
}

.container-top {
    background-color: aliceblue;
    height: 20vh;
    width: 36vw;
    box-shadow: 0 -10px 15px 0 rgba(0, 0, 0, 0.6);
}

.header-side {
    background-color: rgb(0, 101, 189);
    color: aliceblue;
    font-size: 22px;
    text-align: center;
    height: 1.5vw;
    overflow: hidden;
    position: absolute;
    top: 0;
}

.header-top {
    background-color: rgb(0, 101, 189);
    color: aliceblue;
    font-size: 22px;
    text-align: center;
    height: 3vh;
    overflow: hidden;
}

.info-frame-side {
    background-color: aliceblue;
    color: black;
    font-size: 18px;
    overflow: auto;
    position: fixed;
    width: 100%;
    height: 18vw;
    bottom: 0;
    top: 1.5vw;
    padding: 10px;
    overflow-x: hidden;
}

.info-frame-top {
    background-color: aliceblue;
    overflow: auto;
    position: fixed;
    color: black;
    font-size: 18px;
    width: 100%;
    height: 17vh;
    bottom: 0;
    top: 3vh;
    padding: 10px;
    overflow-x: hidden;
}
</style>