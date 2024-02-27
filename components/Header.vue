<template>
 <header class="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
        <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
        <span class="fs-4"> Signature <Icon name="mdi:sign" width="32" height="32"  style="color: #3366ff" /></span>
      </a>

      <!-- <ul class="nav nav-pills">
        <li class="nav-item"><a href="#" class="nav-link active" aria-current="page">Home</a></li>
        <li class="nav-item"><a href="#" class="nav-link">Features</a></li>
        <li class="nav-item"><a href="#" class="nav-link">Pricing</a></li>
        <li class="nav-item"><a href="#" class="nav-link">FAQs</a></li>
        <li class="nav-item"><a href="#" class="nav-link">About</a></li>
      </ul> -->
      <div class="col-md-3 text-end">
        <button type="button" class="btn btn-outline-primary me-2"><Icon name="uim:lock" width="24" height="24" /> Login</button>
        <button type="button" class="btn btn-primary"><Icon name="mdi:register" width="24" height="24" /> Register</button>
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
  