

<script setup>
import { ref, onMounted } from 'vue';
import VueDrawingCanvas from "vue-drawing-canvas";
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import ColorPicker from 'primevue/colorpicker';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel'
const initialImage = ref([
  {
    type: "dash",
    from: {
      x: 262,
      y: 154,
    },
    coordinates: [],
    color: "#000000",
    width: 5,
    fill: false,
  },
]);
const x = ref(0);
const y = ref(0);
const image = ref("");
const eraser = ref(false);
const disabled = ref(false);
const fillShape = ref(false);
const line = ref(5);
const color = ref("#000000");
const strokeType = ref("dash");
const lineCap = ref("square");
const lineJoin = ref("miter");
const backgroundColor = ref("#FFFFFF");
const backgroundImage = ref(null);
const watermark = ref(null);
const additionalImages = ref([]);

const canvasDimensions = ref({ width: 1000, height: 590 });
const VueCanvasDrawing = ref(null);

const setImage = async (event) => {
  let URL = window.URL;
  backgroundImage.value = URL.createObjectURL(event.target.files[0]);
  await Vue.nextTick(); // Ensure the component has re-rendered
  await VueCanvasDrawing.value.redraw();
};
const brushBoldnes = ref(Array.from({ length: 25 }, (_, i) => ({ label: `Pen Thickness- ${i + 1}`, value: i + 1 })));

const strokeTypeOptions = ref([
    { name: 'Straight Line', val: 'line' },
    { name: 'Circle', val: 'circle' },
    { name: 'Square', val: 'square' },
    { name: 'Triangle', val: 'triangle' },
    { name: 'Half Triangle', val: 'half_triangle' }

]);

const lineCapOptions = ref([
    { name: 'LineCap Round', val: 'round' },
    { name: 'LineCap Square', val: 'square' },
    { name: 'LineCap Butt', val: 'butt' },
]);

const lineJoinOptions = ref([
    { name: 'LineJoin Round', val: 'round' },
    { name: 'LineJoin Bevel', val: 'bevel' },
    { name: 'LineJoin Miter', val: 'miter' },
]);

const setWatermarkImage = async (event) => {
  let URL = window.URL;
  watermark.value = {
    type: "Image",
    source: URL.createObjectURL(event.target.files[0]),
    x: 0,
    y: 0,
    imageStyle: {
      width: 600,
      height: 400,
    },
  };
  await Vue.nextTick(); // Ensure the component has re-rendered
  await VueCanvasDrawing.value.redraw();
};

const getCoordinate = (event) => {
  let coordinates = VueCanvasDrawing.value.getCoordinates(event);
  x.value = coordinates.x;
  y.value = coordinates.y;
};

const getStrokes = () => {
  window.localStorage.setItem(
    "vue-drawing-canvas",
    JSON.stringify(VueCanvasDrawing.value.getAllStrokes())
  );
  alert(
    "Strokes saved, reload your browser to see the canvas with previously saved image"
  );
};

const removeSavedStrokes = () => {
  window.localStorage.removeItem("vue-drawing-canvas");
  alert("Strokes cleared from local storage");
};

onMounted(() => {
  if ("vue-drawing-canvas" in window.localStorage) {
    initialImage.value = JSON.parse(
      window.localStorage.getItem("vue-drawing-canvas")
    );
  }
});
</script>

<template>
    <div id="app">
        <div class="flex-row">
            <div class="first-button-line">
                <div class="button-container">
                    <div class="card flex justify-content-center">
                        <Button :severity="disabled ? 'success' : 'danger'" @click.prevent="disabled = !disabled">
                            <span v-if="!disabled">Unlock</span>
                            <span v-else>Lock</span>
                            <Icon v-if="!disabled" name="pepicons-pop:lock-closed" width="24" height="24" />
                            <Icon v-else name="pepicons-pop:lock-open" width="24" height="24" />
                        </Button>
                    </div>
                    <div class="card flex justify-content-center">
                        <Button label="Undo" severity="info" @click.prevent="VueCanvasDrawing.undo()">
                            <Icon name="material-symbols:undo" width="24" height="24" />
                            Undo
                        </Button>
                    </div>
                    <div class="card flex justify-content-center">
                        <Button label="Redo" severity="help" @click.prevent="VueCanvasDrawing.redo()">
                            <Icon name="material-symbols:redo" width="24" height="24" />
                            Redo
                        </Button>
                    </div>

                    <div class="card flex justify-content-center">
                        <Button label="Refresh" severity="warning" @click.prevent="VueCanvasDrawing.redraw()">
                            <Icon name="subway:redo-1" width="24" height="24" />
                            Refresh
                        </Button>
                    </div>

                    <div class="card flex justify-content-center">
                        <Button label="Reset" severity="contrast" @click.prevent="VueCanvasDrawing.reset()">
                            <Icon name="material-symbols:reset-wrench" width="24" height="24" />
                            Reset
                        </Button>
                    </div>

                </div>
            </div>
            <div class="second-button-line">
                <div class="button-container">
                    <div class="card flex justify-content-center">
                        <Button :label="eraser ? 'Eraser' : 'Draw'" :severity="eraser ? 'danger' : 'success'"
                            @click.prevent="eraser = !eraser">
                            <span v-if="eraser">Eraser</span>
                            <span v-else>Draw</span>
                            <Icon v-if="eraser" name="ph:eraser-fill" width="24" height="24" />
                            <Icon v-else name="ph:pen-nib" width="24" height="24" />
                        </Button>
                    </div>

                    <div class="card flex justify-content-center">
                        <Dropdown v-model="line" :options="brushBoldnes" optionLabel="label" optionValue="value"
                            :virtualScrollerOptions="{ itemSize: 25 }" placeholder="Pen Hardnes"
                            class="w-full md:w-14rem" />
                    </div>


                    <div class="card flex justify-content-center">
                        <input type="color" v-model="color" style="height: 38px;" />
                    </div>

                    <div class="card flex justify-content-center">
                        <Dropdown v-model="strokeType" :options="strokeTypeOptions" optionLabel="name" optionValue="val"
                            placeholder="Stroke Type" class="w-full md:w-14rem" />
                    </div>

                    <div class="card flex justify-content-center">
                        <Dropdown v-model="lineCap" :options="lineCapOptions" optionLabel="name" optionValue="val"
                            placeholder="Line Cap" class="w-full md:w-14rem" />
                    </div>

                    <div class="card flex justify-content-center">
                        <Dropdown v-model="lineJoin" :options="lineJoinOptions" optionLabel="name" optionValue="val"
                            placeholder="Line Join" class="w-full md:w-14rem" />
                    </div>

                    <div class="card flex justify-content-center">
                        <Button label="secondary" :severity="fillShape ? 'contrast' : 'secondary'"
                            @click.prevent="fillShape = !fillShape">
                            <span v-if="fillShape">
                                <Icon name="ph:check-circle-fill" width="24" height="24" /> Fill
                            </span>
                            <span v-else>
                                <Icon name="ph:check-circle-light" width="24" height="24" /> Stroke
                            </span>
                        </Button>
                    </div>

                    <div class="card flex justify-content-center">
                        <Button label="Save All Strokes" severity="success" @click.prevent="getStrokes()">
                            <Icon name="material-symbols:imagesmode-outline" width="24" height="24" /> Save All Strokes
                        </Button>
                    </div>
                    <div class="card flex justify-content-center">
                        <Button label="Remove Saved Strokes" severity="danger" @click.prevent="removeSavedStrokes()">
                            <Icon name="material-symbols-light:delete-forever" width="24" height="24" /> Remove Saved
                            Strokes
                        </Button>
                    </div>
                </div>

            </div>
        </div>
        <div class="card">
            <Splitter style="height: 600px" class="mb-5">
                <SplitterPanel  :size="50" class="flex align-items-center justify-content-center">
                    <div class="source">
                        <p>Canvas:</p>
                        <vue-drawing-canvas ref="VueCanvasDrawing" v-model:image="image" :stroke-type="strokeType"
                            :line-cap="lineCap" :line-join="lineJoin" :fill-shape="fillShape" :eraser="eraser"
                            :lineWidth="line" :color="color" :background-color="backgroundColor" :width="canvasDimensions.width" :height="canvasDimensions.height"
                            :background-image="backgroundImage" :watermark="watermark" :initial-image="initialImage"
                            saveAs="png" :styles="{
                                border: 'solid 1px #000',
                            }" :lock="disabled" @mousemove="getCoordinate($event)" :additional-images="additionalImages" />
                        <p>
                            x-axis: <strong>{{ x }}</strong>, y-axis: <strong>{{ y }}</strong>
                        </p>
                    </div>
                </SplitterPanel>
                <SplitterPanel :size="50" class="flex align-items-center justify-content-center">
                    <div class="output">
                        <p>Output:</p>
                        <img :src="image" style="border: solid 1px #000000" />
                    </div>
                </SplitterPanel>
            </Splitter>
        </div>


        <div class="flex-row">
            <div class="button-container">
                <div class="card flex justify-content-center background-color" style="margin-right: 30px">
                    <p style="margin-bottom: 12px">Background Color:</p>
                    <input type="color" v-model="backgroundColor" />
                </div>
                <div class="card flex justify-content-center background-image">
                    <p style="margin-bottom: 12px">Upload Background Image:</p>
                    <input type="file" @change="setImage($event)" />
                </div>
                <div class="card flex justify-content-center water-mark">
                    <p style="margin-bottom: 12px">Upload Watermark Image:</p>
                    <input type="file" @change="setWatermarkImage($event)" />
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@1,700&display=swap");

body {
    font-family: "Roboto", sans-serif;
}

.flex-row {
    display: flex;
    flex-direction: row;
}

.button-container {
    display: flex;
    flex-direction: row;
}

.button-container>* {
    margin-top: 15px;
    margin-right: 10px;
}

.background-color,
.background-image,
.water-mark {
    margin-right: 30px;
    background-color: aliceblue;
    padding: 10px;
    border-radius: 10px;
}
</style>