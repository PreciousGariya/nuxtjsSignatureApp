<template>
    <div>
        <canvas ref="canvas" style="width: 100%; height: 300px;"></canvas>
        <Button @click="clear" label="Danger" severity="danger" />
    </div>
</template>
  
<script setup>
// import { ref, onMounted } from 'vue';
import SignaturePad from 'signature_pad';
import Button from 'primevue/button';

const canvas = ref(null);
const signaturePad = ref(null);

onMounted(() => {
    signaturePad.value = new SignaturePad(canvas.value, {
        backgroundColor: 'rgb(255, 255, 255)',
    });
});

const clear = () => {
    signaturePad.value.clear();
}
</script>
  
<style>
canvas {
    border: 1px solid #000;
}
</style>
