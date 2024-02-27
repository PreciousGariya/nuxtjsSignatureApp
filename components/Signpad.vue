

<script setup>
// import { ref, onMounted } from 'vue';
import VueDrawingCanvas from "vue-drawing-canvas";
import Button from 'primevue/button';
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

const downloadImage = () => {
    console.log('image', VueCanvasDrawing.value.isEmpty());
    // Base64 encoded image
    if(VueCanvasDrawing.value.isEmpty()){
        alert('Please draw something before download');
        return;
    }
    const base64Image = image.value;

      try {
        // Remove data URL prefix
        const base64String = base64Image.split(',')[1];

        // Convert base64 to blob
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' }); // Change the type accordingly

         // Generate file name with current timestamp
         const fileName = 'Signature_draw_goku_' + Date.now() + '.png';

        // Create a link element
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName; // Set the file name

        // Append the link to the body
        document.body.appendChild(link);

        // Trigger the click event on the link
        link.click();

        // Clean up
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading image:', error);
      }
}
onMounted(() => {
    if ("vue-drawing-canvas" in window.localStorage) {
        initialImage.value = JSON.parse(
            window.localStorage.getItem("vue-drawing-canvas")
        );
    }
});
</script>

<template>
    <div class="row">
        <div class="button-container">
            <Button :class="disabled ? 'btn btn-success' : 'btn btn-danger'" @click.prevent="disabled = !disabled">
                <span v-if="!disabled">Unlock</span>
                <span v-else>Lock</span>
                <Icon v-if="!disabled" name="pepicons-pop:lock-closed" width="24" height="24" />
                <Icon v-else name="pepicons-pop:lock-open" width="24" height="24" />
            </Button>
            <Button class="btn btn-danger" label="Undo" severity="info" @click.prevent="VueCanvasDrawing.undo()">
                <Icon name="material-symbols:undo" width="24" height="24" />
                Undo
            </Button>
            <Button label="Redo" class="btn btn-primary" @click.prevent="VueCanvasDrawing.redo()">
                <Icon name="material-symbols:redo" width="24" height="24" />
                Redo
            </Button>

            <Button label="Refresh" class="btn btn-warning" @click.prevent="VueCanvasDrawing.redraw()">
                <Icon name="subway:redo-1" width="24" height="24" />
                Refresh
            </Button>

            <Button label="Reset" class="btn btn-dark" @click.prevent="VueCanvasDrawing.reset()">
                <Icon name="material-symbols:reset-wrench" width="24" height="24" />
                Reset
            </Button>
        </div>
    </div>

    <div class="row">
        <div class="button-container">
            <select v-model="line" class="form-select form-select-sm" aria-label=".form-select-sm example">
                <option selected>Brush thickness</option>
                <option v-for="brush in brushBoldnes" :key="brush.value" :value="brush.value">{{ brush.label }}</option>
            </select>

            <select v-model="strokeType" class="form-select form-select-sm" aria-label=".form-select-sm example">
                <option selected>Stroke Type</option>
                <option v-for="strokeTypeOption in strokeTypeOptions" :key="strokeTypeOption.val"
                    :value="strokeTypeOption.val">{{ strokeTypeOption.name }}</option>
            </select>

            <select v-model="lineCap" class="form-select form-select-sm" aria-label=".form-select-sm example">
                <option selected>Line Cap</option>
                <option v-for="lineCapOption in lineCapOptions" :key="lineCapOption.val" :value="lineCapOption.val">
                    {{ lineCapOption.name }}</option>
            </select>

            <select v-model="lineJoin" class="form-select form-select-sm" aria-label=".form-select-sm example">
                <option selected>Line Cap</option>
                <option v-for="lineJoinOption in lineJoinOptions" :key="lineJoinOption.val" :value="lineJoinOption.val">
                    {{ lineJoinOption.name }}</option>
            </select>


        </div>
    </div>

    <div class="row">
        <div class="button-container">
            <Button :label="eraser ? 'Eraser' : 'Draw'" :class="eraser ? 'btn btn-danger' : 'btn btn-success'"
                @click.prevent="eraser = !eraser">
                <span v-if="eraser">Eraser</span>
                <span v-else>Draw</span>
                <Icon v-if="eraser" name="ph:eraser-fill" width="24" height="24" />
                <Icon v-else name="ph:pen-nib" width="24" height="24" />
            </Button>
            <input type="color" v-model="color" style="height: 38px;" />

            <Button label="secondary" :class="fillShape ? 'btn btn-dark' : 'btn btn-outline-dark'"
                @click.prevent="fillShape = !fillShape">
                <span v-if="fillShape">
                    <Icon name="ph:check-circle-fill" width="24" height="24" /> Fill
                </span>
                <span v-else>
                    <Icon name="ph:check-circle-light" width="24" height="24" /> Stroke
                </span>
            </Button>
            <Button label="Save All Strokes" class="btn btn-success" @click.prevent="getStrokes()">
                <Icon name="material-symbols:imagesmode-outline" width="24" height="24" /> Save All Strokes
            </Button>
            <Button label="Remove Saved Strokes" class="btn btn-danger" @click.prevent="removeSavedStrokes()">
                <Icon name="material-symbols-light:delete-forever" width="24" height="24" /> Remove Saved
                Strokes
            </Button>

        </div>
    </div>

    <div class="row mt-4">
        <div class="col-md-6">
            <div class="source">
                <p>
                    <Icon name="mdi:pen" width="24" height="24" style="color: #3366ff" />
                </p>
                <vue-drawing-canvas ref="VueCanvasDrawing" v-model:image="image" :stroke-type="strokeType"
                    :line-cap="lineCap" :line-join="lineJoin" :fill-shape="fillShape" :eraser="eraser" :lineWidth="line"
                    :color="color" :background-color="backgroundColor" :background-image="backgroundImage"
                    :watermark="watermark" :initial-image="initialImage" saveAs="png" :styles="{
                        border: 'solid 1px #000',
                    }" :lock="disabled" @mousemove="getCoordinate($event)" :additional-images="additionalImages" />
                <p>
                    x-axis: <strong>{{ x }}</strong>, y-axis: <strong>{{ y }}</strong>
                </p>
            </div>
        </div>
        <div class="col-md-6">

            <div class="output">
                <p>
                    <Icon @click.prevent="downloadImage" name="ic:baseline-download" width="24" height="24"
                        style="color: #0a8e06;cursor: pointer;" />
                </p>
                <img :src="image" style="border: solid 1px #000000" />
            </div>
        </div>
    </div>
    <div class="row">
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
</template>

<style scoped>
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