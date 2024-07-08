<template>
    <teleport :to="target" :disabled="!target || disabled" v-if="target">
        <slot></slot>
    </teleport>
</template>

<script>
import { ref } from 'vue'

export default {
    props: {
        to: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    setup() {
        const target = ref(null)
        return {
            target
        }
    },
    mounted() {
        const el = document.querySelector(this.to)
        if (el) {
            this.target = el
        }
    }
}
</script>