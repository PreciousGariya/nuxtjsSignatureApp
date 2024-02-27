<template>
 
 <header>
            <div class="logo">
                <!-- <img src="/signature.png" alt="Logo"> -->
                <h3>Signature</h3>
            </div>
            <div class="buttons">
                <button class="p-button p-button-primary">Login</button>
                <button class="p-button p-button-secondary">Sign Up</button>
            </div>
        </header>
</template>

<style scoped>
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: #f0f0f0;
}

.logo img {
    width: 100px; /* Adjust according to your logo size */
    height: auto;
    
}

.buttons button {
    margin-left: 10px;
}
</style>
  