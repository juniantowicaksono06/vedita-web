<template>
    <Record/>
</template>

<script>
    import Record from '../components/record/Main.vue'
    export default {
        name: "Recording",
        components: {
            Record
        },
        head() {
            return {
                title: "Vedita - LiVe Digital Assistance"
            }
        }
    }
</script>