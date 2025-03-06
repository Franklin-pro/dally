<script setup lang="ts">
const items = [{
  key: 'category',
  label: 'Category',
}, {
  key: 'chapter',
  label: 'Chapter',
},
{
  key: 'article',
  label: 'Article',
},
{
  key: 'iteka',
  label: 'Iteka',
}
]

definePageMeta({
  layout: 'default',
  title: 'Home',
})

</script>

<template>
  <UTabs :items="items" class="w-full">
    <template #item="{ item }">
        <div v-if="item.key === 'category'" class="space-y-3">
<SectionsCategory/>
        </div>
        <div v-else-if="item.key === 'chapter'" class="space-y-3">
 <SectionsChapter/>
        </div>
        <div v-else-if="item.key === 'article'" class="space-y-3">
 <SectionsArticle/>
        </div>
        <div v-else-if="item.key === 'iteka'" class="space-y-3">
 <SectionsIteka/>
        </div>
    </template>
  </UTabs>
</template>

