<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import QuestionCommon from '@/components/common/Question.common.vue'
  import questionsApi, { type Question } from '@/lib/api/question.api'
  import { indexValue, useNavStore } from '@/stores/nav.store'

  const nav = useNavStore()
  const setNav = (param: indexValue) => nav.setIndex(param)
  const questions = ref<Question[]>([])
  const loading = ref(false)
  const errorMessage = ref('')

  const options = [
    { label: 'Récentes', value: 'newest' },
    { label: 'Plus répondues', value: 'mostAnswered' },
    { label: 'Activité récente', value: 'recentActivity' },
  ]

  const model = ref('newest')

  async function loadQuestions() {
    loading.value = true
    errorMessage.value = ''

    try {
      const result = await questionsApi.list({
        page: 1,
        limit: 10,
        sort: model.value,
      })

      questions.value = result.items
    } catch {
      errorMessage.value = 'Impossible de charger les questions.'
    } finally {
      loading.value = false
    }
  }

  function applyFilter() {
    loadQuestions()
  }

  onMounted(loadQuestions)
</script>

<template>
  <section class="questions-page">
    <header class="page-header">
      <div class="page-title">
        <h1 class="va-h4">Questions</h1>
        <VaButton @click="setNav(indexValue.question_form)">Poser une question</VaButton>
      </div>

      <!-- <div class="page-filters">
        <VaButtonToggle
          v-model="model"
          :options="options"
          preset="secondary"
          color="primary"
          @update:model-value="applyFilter"
        />
      </div> -->
    </header>

    <div v-if="loading" class="message">Chargement des questions...</div>

    <div v-else-if="errorMessage" class="message">
      <p>{{ errorMessage }}</p>
      <VaButton preset="secondary" @click="loadQuestions"> Réessayer </VaButton>
    </div>

    <div v-else-if="questions.length === 0" class="message">Aucune question pour le moment.</div>

    <div v-else class="question-list">
      <QuestionCommon v-for="question in questions" :key="question.id" :question="question" />
    </div>
  </section>
</template>

<style scoped>
  .questions-page {
    width: 100%;
    min-width: 0;
  }

  .page-header {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .page-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .page-title h1 {
    margin: 0;
  }

  .page-filters {
    display: flex;
    justify-content: flex-end;
  }

  .question-list {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .message {
    padding: 2rem 1rem;
    text-align: center;
  }

  @media (max-width: 600px) {
    .page-title {
      align-items: flex-start;
    }

    .page-filters {
      justify-content: flex-start;
      overflow-x: auto;
      max-width: 100%;
    }
  }
</style>
