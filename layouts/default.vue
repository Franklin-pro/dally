<template>
  <div>
    <div class="space-y-1 flex items-center justify-center p-4 gap-5">
      <URadio
        v-for="lang of languages"
        :key="lang.value"
        v-model="selectedLanguage"
        v-bind="lang"
      />
    </div>
    <div>
      <slot />
    </div>
    <div>
      <!-- <Footer/> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLanguage } from '~/composables/useLanguage';

const { selectedLanguage, languages } = useLanguage();

</script>

<style>
/* Your styles here */
</style>