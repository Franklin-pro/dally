import { ref, computed } from 'vue';
import { useState } from '#app';

export const useLanguage = () => {
  const languages = ref([
    { value: 'kiny', label: 'Kinyarwanda' },
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'French' },
  ]);
  const selectedLanguage = useState<string>('selectedLanguage', () => 'en');

  const selectedLanguageObject = computed(() => {
    return languages.value.find(lang => lang.value === selectedLanguage.value);
  });

  const setLanguage = (lang: string) => {
    selectedLanguage.value = lang;
  };

  return {
    languages: languages,
    selectedLanguage: selectedLanguage, 
    selectedLanguageObject,
    setLanguage
  };
};