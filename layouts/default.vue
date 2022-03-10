<template>
  <div class="bg-gray-100 min-h-screen text-gray-900">
    <Title>{{ pageTitle }}</Title>
    <nav class="bg-white shadow text-lg px-6 py-6">
      <div class="container mx-auto flex items-center justify-between px-6">
        <div>
          <NuxtLink to="/">Home</NuxtLink>
        </div>
        <div>
          <ClientOnly>
            <ul class="flex space-x-12">
              <li><NuxtLink to="/completed">Completed</NuxtLink></li>
              <li v-if="!isLoggedIn">
                <NuxtLink to="/not-completed">Not Completed</NuxtLink>
              </li>
            </ul>
          </ClientOnly>
        </div>
      </div>
    </nav>
    <slot />
  </div>
</template>

<script setup>
const pageTitle = useState('pageTitle', () => 'Todo')

</script>
