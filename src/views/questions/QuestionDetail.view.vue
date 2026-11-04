<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import questionsApi from '@/lib/api/question.api'
  import answersApi from '@/lib/api/answers.api'
  import type { Answer } from '@/lib/api/answers.api'
  import type { Question } from '@/lib/api/question.api'
  import AnswerCommon from '@/components/common/Answer.common.vue'

  const route = useRoute()

  const question = ref<Question | null>(null)
  const answers = ref<Answer[]>([])

  const loadingQuestion = ref(false)
  const loadingAnswers = ref(false)
  const submitting = ref(false)

  const error = ref('')
  const answerError = ref('')
  const answerContent = ref('')

  async function loadQuestion() {
    const slug = String(route.params.slug ?? '')

    if (!slug) return

    loadingQuestion.value = true
    loadingAnswers.value = false
    error.value = ''
    question.value = null
    answers.value = []

    try {
      question.value = await questionsApi.getBySlug(slug)
      await loadAnswers()
    } catch {
      error.value = 'Impossible de charger cette question.'
    } finally {
      loadingQuestion.value = false
    }
  }

  async function loadAnswers() {
    if (!question.value) return

    loadingAnswers.value = true

    try {
      const response = await answersApi.list(question.value.id, {
        page: 1,
        limit: 20,
      })

      answers.value = response.items
    } catch {
      answerError.value = 'Impossible de charger les réponses.'
    } finally {
      loadingAnswers.value = false
    }
  }

  async function submitAnswer() {
    if (!question.value || !answerContent.value.trim() || submitting.value) {
      return
    }

    submitting.value = true
    answerError.value = ''

    try {
      const answer = await answersApi.create(question.value.id, answerContent.value.trim())

      // Ajouter la réponse créée à la liste affichée.
      answers.value.unshift(answer)
      answerContent.value = ''
    } catch {
      answerError.value =
        'Impossible de publier votre réponse. Vérifiez votre connexion et votre authentification.'
    } finally {
      submitting.value = false
    }
  }

  watch(
    () => route.params.slug,
    () => loadQuestion(),
    { immediate: true }
  )
</script>

<template>
  <main class="question-detail">
    <div v-if="loadingQuestion" class="state">Chargement de la question...</div>

    <div v-else-if="error" class="state state--error">
      {{ error }}
    </div>

    <template v-else-if="question">
      <section class="question">
        <div class="question__tags">
          <span v-for="tag in question.tags" :key="tag.id" class="tag">
            {{ '#' + tag.name }}
          </span>
        </div>

        <h6 class="va-h6">{{ question.title }}</h6>

        <div class="question__author">
          <VaAvatar
            :src="question.author?.avatarUrl ?? undefined"
            :fallback-text="question.author?.username?.charAt(0).toUpperCase() ?? '?'"
            size="36px"
          />

          <span>
            Posée par
            <strong>
              {{ question.author?.username ?? 'Utilisateur inconnu' }}
            </strong>
          </span>

          <span class="muted">
            {{ new Date(question.createdAt).toLocaleDateString('fr-FR') }}
          </span>
        </div>

        <div class="question__content">
          {{ question.content }}
        </div>

        <div class="question__meta">
          <span>
            {{ question.isResolved ? 'Résolue' : 'En attente de réponse' }}
          </span>

          <span> {{ question.answerCount }} réponse(s) </span>
        </div>
      </section>

      <section class="answers-section">
        <h6 class="va-h6">Réponses ({{ answers.length }})</h6>

        <div v-if="loadingAnswers" class="state">Chargement des réponses...</div>

        <div v-else-if="answerError && answers.length === 0" class="state state--error">
          {{ answerError }}
          <VaButton preset="plain" @click="loadAnswers"> Réessayer </VaButton>
        </div>

        <div v-else-if="answers.length === 0" class="state">
          Aucune réponse pour le moment. Soyez le premier à répondre !
        </div>

        <AnswerCommon v-for="answer in answers" :key="answer.id" :answer="answer" />

        <p v-if="answerError && answers.length > 0" class="state--error">
          {{ answerError }}
        </p>
      </section>

      <section v-if="question.status === 'OPEN'" class="answer-form">
        <h6 class="va-h6">Votre réponse</h6>

        <VaTextarea
          v-model="answerContent"
          label="Rédigez votre réponse"
          placeholder="Partagez vos connaissances ou votre point de vue..."
          :min-rows="5"
          autosize
          class="answer-form__input"
        />

        <p v-if="answerError && answers.length > 0" class="state--error">
          {{ answerError }}
        </p>

        <div class="answer-form__actions">
          <VaButton
            :loading="submitting"
            :disabled="!answerContent.trim() || submitting"
            @click="submitAnswer"
          >
            Publier ma réponse
          </VaButton>
        </div>

        <p v-if="answerError && answers.length === 0" class="state--error">
          {{ answerError }}
        </p>
      </section>

      <p v-else class="state">
        Cette question est fermée : les nouvelles réponses ne sont plus acceptées.
      </p>
    </template>
  </main>
</template>

<style scoped>
  .question-detail {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    padding: 1.5rem;
  }

  .question {
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--va-background-border);
  }

  .question__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .question h1 {
    margin: 0 0 1rem;
    font-size: clamp(1.5rem, 3vw, 2rem);
    line-height: 1.3;
  }

  .question__author {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.65rem;
    font-size: 0.9rem;
  }

  .muted {
    color: var(--va-secondary);
  }

  .question__content {
    margin: 1.5rem 0;
    line-height: 1.8;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .question__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    color: var(--va-secondary);
    font-size: 0.875rem;
  }

  .answers-section,
  .answer-form {
    margin-top: 2rem;
  }

  .answers-section h2,
  .answer-form h2 {
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  .state {
    padding: 1rem 0;
    color: var(--va-secondary);
  }

  .state--error {
    color: var(--va-danger);
  }

  .answer-form {
    padding-top: 1.5rem;
    border-top: 1px solid var(--va-background-border);
  }

  .answer-form__input {
    width: 100%;
  }

  .answer-form__actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
  }

  @media (max-width: 600px) {
    .question-detail {
      padding: 1rem;
    }
  }
</style>
