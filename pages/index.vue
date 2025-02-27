<script setup lang="ts">
const items = [{
  key: 'english',
  label: 'English',
}, {
  key: 'kinyarwanda',
  label: 'Kinyarwanda',
},
{
  key: 'french',
  label: 'French',
},
{
  key: 'iteka',
  label: 'Iteka',
}
]

</script>

<template>
  <UTabs :items="items" class="w-full">
    <template #item="{ item }">
        <div v-if="item.key === 'english'" class="space-y-3">
<SectionsEnglish/>
        </div>
        <div v-else-if="item.key === 'french'" class="space-y-3">
 <SectionsFrench/>
        </div>
        <div v-else-if="item.key === 'kinyarwanda'" class="space-y-3">
 <SectionsKinyarwanda/>
        </div>
        <div v-else-if="item.key === 'iteka'" class="space-y-3">
 <SectionsIteka/>
        </div>
    </template>
  </UTabs>
</template>

