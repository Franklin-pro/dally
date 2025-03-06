<template>
  <div class="p-2 flex justify-center flex-col items-center">
    <div class="grid grid-cols-2 justify-center w-1/2 p-4 gap-4 items-center">
      <div class="space-y-2">
        <label for="title">Title</label>
        <UInput placeholder="text ..." v-model="form.title" class="w-full" size="lg" />
      </div>
      <div class="space-y-2">
        <label for="category">Category</label>
        <USelect
          :options="selectCategory"
          option-attribute="title"
          placeholder="Select Category"
          v-model="form.category"
          class="w-full"
          size="lg"
        />
      </div>
      <div class="space-y-2">
        <label for="language">Language</label>
        <UInput placeholder="text ..." v-model="selectedLanguage" class="w-full" disabled size="lg" />
      </div>

      <div class="col-span-2 space-y-2">
        <label for="description">Description</label>
        <UTextarea placeholder="text ..." v-model="form.description" />
      </div>
      <div>
        <UButton class="py-1 px-20" @click="saveChapter" :loading="isSaving">Save Chapter</UButton>
      </div>
    </div>
    <div class="w-1/2">
      <div v-if="isLoading">Loading Chapters...</div>
      <div v-else>
        <UTable :rows="data" :columns="columns" v-model:selected="selectedRows" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { useLanguage } from '~/composables/useLanguage';

const BASEURL = 'http://85.239.242.194:8585';

interface Chapter {
  id: number;
  lang: string;
  title: string;
  category: string;
  description: string;
}

interface Category {
  id: number;
  lang: string;
  title: string;
}

interface FormType {
  title: string;
  category: string;
  description: string;
}

const { selectedLanguage } = useLanguage();

const data = ref<Chapter[]>([]);
const isLoading = ref(false);
const isSaving = ref(false);
const selectCategory = ref<Category[]>([]);

const form = reactive<FormType>({
  title: '',
  category: '',
  description: '',
});
const selectedRows = ref<Chapter[]>([]);

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
    key: 'categoryId',
    label: 'Category',
  },
  {
    key: 'description',
    label: 'Description',
  },
];

const localStorageKey = 'chapterData'; // Key for localStorage
const selectedCategoryKey = 'selectedCategory'; // Key for selected category

const fetchCategory = async () => {
    isLoading.value = true;
    try {
        const { data: responseData, error } = await useFetch<Category[]>(`${BASEURL}/categories/all/${selectedLanguage.value}`);

        if (error.value) {
            console.error('Error fetching categories:', error.value);
        } else {
            if (responseData.value) {
                selectCategory.value = responseData.value;
            } else {
                selectCategory.value = [];
                console.warn('No categories returned from the API.');
            }
        }
    } finally {
        isLoading.value = false;
    }
};

const fetchChapter = async () => {
    isLoading.value = true;
    try {
        const categoryId = form.category ? form.category : '3';

        const { data: responseData, error } = await useFetch<Chapter[]>(`${BASEURL}/chaptersByCategory/${categoryId}/${selectedLanguage.value}`);

        if (error.value) {
            console.error('Error fetching chapters:', error.value);
        } else {
            if (responseData.value) {
                data.value = responseData.value;
            } else {
                data.value = [];
                console.warn('No chapters returned from the API.');
            }
        }
    } finally {
        isLoading.value = false;
    }
};

const saveChapter = async () => {
    isSaving.value = true;
    try {
        const newChapter = {
            lang: selectedLanguage.value,
            title: form.title,
            category: form.category,
            description: form.description,
        };

        const { data: responseData, error } = await useFetch<Chapter>(`${BASEURL}/saveChapter/${selectedLanguage.value}`, {
            method: 'POST',
            body: newChapter,
        });

        if (error.value) {
            console.error('Error saving chapter:', error.value);
        } else {
            console.log('Chapter saved successfully:', responseData.value);
            await fetchChapter();

            form.title = '';
            form.category = '';
            form.description = '';
        }
    } catch (err) {
        console.error('An unexpected error occurred:', err);
    } finally {
        isSaving.value = false;
    }
};

onMounted(() => {
    // Load category selection from localStorage on mount
    const storedCategory = localStorage.getItem(selectedCategoryKey);
    if (storedCategory) {
        form.category = storedCategory;
    }

    fetchCategory().then(() => {
        fetchChapter();  //Fetch chapter after categories are loaded to show the data related to the last selected category.
    });
});

watch(selectedLanguage, () => {
    fetchCategory();
    fetchChapter();
});

watch(
    () => form.category,
    (newCategory) => {
        // Save category selection to localStorage
        localStorage.setItem(selectedCategoryKey, newCategory);
        fetchChapter();
    }
);

// Persist data to localStorage before unmount
watch(data, (newData) => {
    localStorage.setItem(localStorageKey, JSON.stringify(newData));
}, { deep: true });
</script>

<style scoped></style>