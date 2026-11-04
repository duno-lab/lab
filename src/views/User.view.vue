<script setup lang="ts">
  import ArticleLayout from '@/components/layout/Article.layout.vue'
  import CreateArticleLayout from '@/components/layout/CreateArticle.layout.vue'
  import DraftLayout from '@/components/layout/Draft.layout.vue'
  import QuestionLayout from '@/components/layout/Question.layout.vue'
  import QuestionFormWidget from '@/components/widget/QuestionForm.widget.vue'
  import { indexValue, useNavStore } from '@/stores/nav.store'
  import { computed } from 'vue'

  const nav = useNavStore()
  const stepper = computed(() => nav.index)
</script>

<template>
  <div class="head" v-if="false">
    <VaButton preset="primary">Filtrer</VaButton>
    <VaButton>Poser Une Question</VaButton>
  </div>
  <ArticleLayout v-if="stepper === indexValue.article" />
  <QuestionFormWidget v-else-if="stepper === indexValue.question_form" />
  <QuestionLayout v-else-if="stepper === indexValue.question" />
  <CreateArticleLayout v-else-if="stepper === indexValue.article_form" />
  <DraftLayout v-else-if="stepper === indexValue.draft" />
</template>
<style scoped>
  .head {
    margin: auto;
    max-width: 600px;
    padding: 5dvh 5%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 5px;
  }
  .input {
    width: 100%;
  }
</style>
