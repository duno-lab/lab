<script setup lang="ts">
  import questionsApi from '@/lib/api/question.api'
  import { computed, reactive, ref } from 'vue'
  import TagSelector from '@/components/common/TagSelector.common.vue'

  const form = reactive({
    title: '',
    content: '',
    tagIds: [] as string[],
  })

  const loading = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')

  const titleLength = computed(() => form.title.trim().length)

  async function submitQuestion() {
    errorMessage.value = ''
    successMessage.value = ''

    if (form.tagIds.length === 0) {
      errorMessage.value = 'Sélectionnez au moins un tag.'
      return
    }

    if (titleLength.value < 10) {
      errorMessage.value = 'Le titre doit contenir au moins 10 caractères.'
      return
    }

    if (form.content.trim().length < 20) {
      errorMessage.value = 'Ajoutez davantage de contexte (20 caractères minimum).'
      return
    }

    loading.value = true

    try {
      await questionsApi.create({
        title: form.title.trim(),
        content: form.content.trim(),
        tagIds: form.tagIds,
      })

      successMessage.value = 'Votre question a été publiée.'

      form.title = ''
      form.content = ''
      form.tagIds = []
    } catch {
      errorMessage.value = 'Impossible de publier la question. Réessayez.'
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <form @submit.prevent="submitQuestion">
    <header class="header">
      <span class="eyebrow">DUNO-LAB / COMMUNAUTÉ</span>

      <div class="title">
        <h6 class="va-h6">Poser une question</h6>
        <VaButton type="submit" :loading="loading" :disabled="loading"> Publier </VaButton>
      </div>

      <p>Décrivez votre problème pour obtenir des réponses pertinentes.</p>
    </header>

    <div class="field">
      <label for="tags">Tags</label>
      <TagSelector id="tags" v-model="form.tagIds" />
    </div>

    <div class="field">
      <label for="question-title">Votre question</label>
      <VaInput
        id="question-title"
        v-model="form.title"
        placeholder="Ex. : Comment gérer les erreurs dans Fastify ?"
        :maxlength="160"
        :disabled="loading"
        class="full-width"
      />
      <span class="hint">{{ titleLength }}/160 caractères</span>
    </div>

    <div class="field">
      <label for="question-content">Contexte et détails</label>
      <VaTextarea
        id="question-content"
        v-model="form.content"
        placeholder="Expliquez le problème, ce que vous avez essayé et le résultat attendu..."
        :min-rows="7"
        :max-rows="14"
        :maxlength="10000"
        :disabled="loading"
        class="full-width"
      />
      <span class="hint"> Ajoutez les détails nécessaires pour comprendre votre problème. </span>
    </div>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </form>
</template>

<style scoped>
  .header {
    margin-bottom: 2rem;
  }

  .eyebrow,
  .hint {
    color: var(--va-secondary);
    font-size: 0.8rem;
  }

  .eyebrow {
    display: block;
    margin-bottom: 0.75rem;
    letter-spacing: 0.08em;
  }

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .title h6 {
    margin: 0;
  }

  .header p {
    color: var(--va-secondary);
    line-height: 1.6;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .field label {
    font-weight: 600;
  }

  .full-width {
    width: 100%;
  }

  .error {
    color: var(--va-danger);
  }

  .success {
    color: var(--va-success);
  }

  @media (max-width: 600px) {
    .title {
      align-items: flex-start;
    }
  }
</style>
