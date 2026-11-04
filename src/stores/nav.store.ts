import { ref } from 'vue'
import { defineStore } from 'pinia'
export enum indexValue {
  article = 'article',
  article_form = 'article_form',
  draft = 'draft',
  question = 'question',
  question_form = 'question_form',
  bookmark = 'bookmark',
  follow = 'follow',
}
export const useNavStore = defineStore('nav', () => {
  const index = ref<indexValue>(indexValue.article)
  function setIndex(indexP: indexValue) {
    index.value = indexP
  }

  return {
    index,
    setIndex,
  }
})
