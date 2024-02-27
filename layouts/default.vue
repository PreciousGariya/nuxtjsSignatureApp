<template>
    <main>
        <Header/>
        
        <slot/>

        <Footer/>
        
    </main>
</template>
<style scoped>
body {
  font-family: "Montserrat", cursive;
  background-position: center;
  background-size: cover;
  height: 100vh;
}
</style>

<script>
import Header from '~/components/Header'
import Footer from '~/components/Footer'
</script>