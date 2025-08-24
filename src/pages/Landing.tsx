<template>
  <div class="text-base sm:text-lg md:text-xl">
    <h1 class="text-2xl sm:text-3xl md:text-4xl">Welcome to Our Landing Page</h1>
    <p class="text-base sm:text-lg md:text-xl">This is a responsive landing page built with Tailwind CSS.</p>
    <nav class="flex space-x-4">
      <a href="#" class="text-sm sm:text-base md:text-lg">Home</a>
      <a href="#" class="text-sm sm:text-base md:text-lg">About</a>
      <a href="#" class="text-sm sm:text-base md:text-lg">Contact</a>
    </nav>
    <button class="px-4 py-2 text-sm sm:text-base md:text-lg bg-blue-500 text-white rounded">Get Started</button>
  </div>
</template>

<script>
export default {
  name: 'Landing'
}
</script>

<style scoped>
/* Add any additional styles here */
</style>