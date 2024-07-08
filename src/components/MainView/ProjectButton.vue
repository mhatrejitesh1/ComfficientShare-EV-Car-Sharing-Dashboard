<template>
    <button :class="{ active: isClicked }" :id="index">
        {{ name }}
    </button>
</template>

<script>
    import interact from 'interactjs';

    export default {
        name: "ProjectButton",
        props: {
            name: String,
            isClicked: Boolean,
            index: String,
        },
        data() {
            return {
                id: this.index
            }
        },
        methods: {
            sendMessage() {
                this.$emit("clickedButton", this.id);
            }
        },
        mounted: function() {
            let element = document.getElementById(this.id);
            interact(element).on("tap", () => this.sendMessage());
        }
    }
</script>

<style scoped>
    .active {
        background-color: rgb(227, 114, 34);
        font-size: 18px;
        max-width: 20vw;
    }
    button {
        background-color: rgb(106, 117, 126);
        color: aliceblue;
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
        border: none;
        border-radius: 4px;
        font-size: 16px;
        text-align: center;
        display: inline-block;
        transition-duration: 0.4s;
        cursor: pointer;
        padding: 10px;
        height: 6vh;
        width: 10vw;
    }
</style>