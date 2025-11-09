<script setup>
import { onBeforeMount, onMounted, ref } from 'vue';

const emit = defineEmits(['show', 'hidden'])

const observer = ref(null);
const observerElement = ref(null)
const observerOptions = ref({
    rootMargin: '0px',
    threshold: 1.0
})

onMounted(() => {
    createObserver();
})

onBeforeMount(() => {
    if (observer.value && observerElement.value) {
        observer.value.unobserve(observerElement.value)
    }
})


const createObserver = () => {
    observer.value = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            emit('show')
        } else {
            emit('hidden')
        }
    }, observerOptions.value);

    observer.value.observe(observerElement.value)
}
</script>

<template>
    <div ref="observerElement" style="height: 1px;"></div>
</template>

<style scoped></style>