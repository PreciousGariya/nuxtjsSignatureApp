<template>
    <div class="album py-5 bg-light">
    <div class="container">
      <div class="row g-3">
          <SignPad />
      </div>
    </div>
  </div>
</template>

<script setup>
import SignPad from '~/components/Signpad.vue';

// import SignaturePad from '~/components/SignaturePad.vue';

const value = ref("");
const items = ref([]);
const date = ref();
const search = (event) => {
    items.value = [...Array(10).keys()].map((item) => event.query + '-' + item);
}
</script>