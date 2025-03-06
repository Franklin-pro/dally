<template>
  <div class="p-2 flex justify-center flex-col items-center">
    <div class="grid grid-cols-2 justify-center w-1/2 p-4 gap-4 items-center">
      <div class="space-y-2">
        <label for="Category">Title</label>
        <UInput placeholder="text ..." v-model="form.title" class="w-full" size="lg" />
      </div>
      <div class="space-y-2">
        <label for="section">Law No</label>
        <UInput placeholder="text ..." v-model="form.lawNo" class="w-full" size="lg" />
      </div>
      <div class="space-y-2">
        <label for="section">Language</label>
        <UInput placeholder="text ..." v-model="selectedLanguage" class="w-full" disabled size="lg" />
      </div>

      <div class="col-span-2 space-y-2">
        <label for="description">Description</label>
        <UTextarea placeholder="text ..." v-model="form.description" />
      </div>
      <div>
        <UButton class="py-1 px-20" @click="saveCategory" :loading="isSaving">Save Category</UButton>
      </div>
    </div>
    <div class="w-1/2">
      <div v-if="isLoading">Loading Categories...</div>
      <div v-else>
        <UTable :rows="categories" :columns="columns" v-model:selected="selectedRows" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { useLanguage } from '~/composables/useLanguage';

const BASEURL = 'http://85.239.242.194:8585';

interface Category {
  id: number;
  language: string;
  title: string;
  lawNo: string;
  description: string;
}

interface FormType {
  title: string;
  lawNo: string;
  description: string;
}

const { selectedLanguage } = useLanguage();

const isLoading = ref(false);
const isSaving = ref(false);
const categories = ref<Category[]>([]);

const localStorageKey = 'categoryData'; // Key for localStorage

const columns = [
  {
    key: 'lang',
    label: 'Language',
  },
  {
    key: 'title',
    label: 'Title',
  },
  {
    key: 'lawNo',
    label: 'Law No',
  },
  {
    key: 'description',
    label: 'Description',
  },
];

const form = reactive<FormType>({
  title: '',
  lawNo: '',
  description: '',
});

const selectedRows = ref<Category[]>([]);

const fetchCategory = async () => {
  isLoading.value = true;
  try {
    const { data: responseData, error } = await useFetch<Category[]>(
      `${BASEURL}/categories/all/${selectedLanguage.value}`
    );

    if (error.value) {
      console.error('Error fetching categories:', error.value);
      // Handle error (e.g., display a message to the user)
    } else {
      if (responseData.value) {
        categories.value = responseData.value;
        localStorage.setItem(localStorageKey, JSON.stringify(categories.value)); // Save to localStorage
      } else {
        categories.value = [];
        console.warn('No categories returned from the API.');
      }
    }
  } finally {
    isLoading.value = false;
  }
};

const saveCategory = async () => {
  isSaving.value = true;
  try {
    const newCategory: Category = {
      id: Date.now(), // The backend should handle the ID generation, not the frontend. Remove this if the backend generates it.
      language: selectedLanguage.value,
      title: form.title,
      lawNo: form.lawNo,
      description: form.description,
    };

    const { data: responseData, error } = await useFetch<Category>(
      `${BASEURL}/categories/${selectedLanguage.value}`,
      {
        method: 'POST',
        body: newCategory, // Send the newCategory directly
      }
    );

    if (error.value) {
      console.error('Error saving category:', error.value);
      // Handle the error (e.g., show an error message)
    } else {
      console.log('Category saved successfully:', responseData.value);
      // Refetch categories to update the table
      await fetchCategory();
      // Clear the form
      form.title = '';
      form.lawNo = '';
      form.description = '';
    }
  } catch (err) {
    console.error('An unexpected error occurred:', err);
    // Handle the error (e.g., show an error message)
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  // Load data from localStorage on mount
  const storedCategories = localStorage.getItem(localStorageKey);
  if (storedCategories) {
    categories.value = JSON.parse(storedCategories);
  } else {
    // Fetch data from API if not found in localStorage
    fetchCategory();
  }
});

// Watch for changes in selectedLanguage and refetch data
watch(selectedLanguage, () => {
  fetchCategory();
});
</script>

<style scoped>
/* Add scoped styles here */
</style>