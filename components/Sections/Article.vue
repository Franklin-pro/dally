<template>
  <div class="p-2 flex justify-center flex-col items-center">
    <div class="grid grid-cols-2 justify-center w-1/2 p-4 gap-4 items-center">
      <div class="space-y-2">
        <label for="title">Title</label>
        <UInput placeholder="Article title ..." v-model="form.title" class="w-full" size="lg" />
      </div>
      <div class="space-y-2">
        <label for="chapterId">Chapter ID</label>
        <UInput placeholder="Chapter ID ..." v-model="form.chapterId" class="w-full" size="lg" />
      </div>
      <div class="space-y-2">
        <label for="language">Language</label>
        <UInput placeholder="text ..." v-model="selectedLanguage" class="w-full" disabled size="lg" />
      </div>
    </div>
    <div class=" w-1/2 flex justify-start items-center pl-4 gap-4">
      <UButton class="py-1 px-20" @click="saveArticle" :loading="isSaving">Save Article</UButton>
    </div>

    <div class="w-1/2">
      <div v-if="isLoading">Loading Articles...</div>
      <div v-else>
        <UTable :rows="article" :columns="columns" v-model:selected="selectedRows" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { useLanguage } from '~/composables/useLanguage';

const BASEURL = 'http://85.239.242.194:8585';

interface Article {
  id: number;
  lang: string;
  title: string;
  chapterId: string;
}

interface FormType {
  title: string;
  chapterId: string;
}

const { selectedLanguage } = useLanguage();

const localStorageKey = 'articleData'; 

const article = ref<Article[]>([]);
const isLoading = ref(false);
const isSaving = ref(false);

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
    key: 'chapterId',
    label: 'Chapter ID',
  },
];

const form = reactive<FormType>({
  title: '',
  chapterId: '',
});

const selectedRows = ref<Article[]>([]);

const fetchArticles = async () => {
  isLoading.value = true;
  try {
    const { data: responseData, error } = await useFetch<Article[]>(
      `${BASEURL}/articles/all/${selectedLanguage.value}`
    );

    if (error.value) {
      console.error('Error fetching articles:', error.value);
    } else {
      if (responseData.value) {
        article.value = responseData.value;
        localStorage.setItem(localStorageKey, JSON.stringify(article.value));
      } else {
        article.value = [];
        console.warn('No articles returned from the API.');
      }
    }
  } finally {
    isLoading.value = false;
  }
};

const saveArticle = async () => {
  isSaving.value = true;
  try {
    const newArticle = {
      lang: selectedLanguage.value,
      title: form.title,
      chapterId: form.chapterId,
    };

    const { data: responseData, error } = await useFetch<Article>(
      `${BASEURL}/articles/${selectedLanguage.value}`,
      {
        method: 'POST',
        body: newArticle,
      }
    );

    if (error.value) {
      console.error('Error saving article:', error.value);
    } else {
      console.log('Article saved successfully:', responseData.value);
      await fetchArticles();
      form.title = '';
      form.chapterId = '';
    }
  } catch (err) {
    console.error('An unexpected error occurred:', err);
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  const storedArticles = localStorage.getItem(localStorageKey);
  if (storedArticles) {
    article.value = JSON.parse(storedArticles);
  } else {
    fetchArticles();
  }
});

watch(selectedLanguage, () => {
  fetchArticles();
});
</script>

<style scoped>

</style>