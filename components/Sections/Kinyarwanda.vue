<template>
  <div class=" p-2 flex justify-center flex-col items-center">
<div class="grid grid-cols-2 justify-center w-1/2 p-4 gap-4 items-center">
  <div class="space-y-2">
    <label for="chapter">Chapters</label>
    <USelect
    v-model="article"
    :Chapters="chapter"
    Chapter-attribute="name"
    size="lg" 
  />
  </div>
<div class="space-y-2">
  <label for="article">Articles</label>
  <USelect
    v-model="article"
    :Chapters="articles"
    Chapter-attribute="name" 
    class="w-full"
    size="lg"
  />
</div>

  <div class=" col-span-2 space-y-2">
    <label for="description">Description</label>
<UTextarea placeholder="text ..."/>
  </div>
  <div>
    <UButton class="py-1 px-20">Save</UButton>
  </div>

</div>
<div class="w-1/2">
  <UTable v-model="selected" :rows="data" @select="select" />
</div>

  </div>
</template>

<script lang="ts" setup>

const article = ref()


const chapter = [
  { id: 1, name: 'Chapter 1' },
  { id: 2, name: 'Chapter 2' },
  { id: 3, name: 'Chapter 3' },
]
const articles = [
  { id: 1, name: 'article 1' },
  { id: 2, name: 'article 2' },
  { id: 3, name: 'article 3' },
]

const data = [
  {
    id:1,
    Chapter: 'Lindsay Walton',
    Article: 'lindsay.walton@example.com',
    description: 'Front-end Developer',
  }
]
const selected = ref([data[1]])
function select(row) {
  const index = selected.value.findIndex(item => item.id === row.id)
  if (index === -1) {
    selected.value.push(row)
  } else {
    selected.value.splice(index, 1)
  }
}

</script>

<style>

</style>