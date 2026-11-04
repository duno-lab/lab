<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import articlesApi from '@/lib/api/articles.api'
  import DraftAlertCommon from '../common/DraftAlert.common.vue'
  import TagSelectorCommon from '../common/TagSelector.common.vue'

  interface Article {
    id: string
    title: string
    slug: string
  }

  type ModalResult =
    | { status: 'success'; article: Article }
    | { status: 'error'; message: string }
    | { status: 'published'; article: Article }

  const form = reactive({
    title: '',
    content: '',
    commentsEnabled: true,
    tagIds: [] as string[],
  })

  const loading = ref(false)
  const modalActive = ref(false)
  const modalResult = ref<ModalResult | null>(null)

  function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message
    }

    return 'Une erreur inattendue est survenue. Veuillez réessayer.'
  }

  function resetForm() {
    form.title = ''
    form.content = ''
    form.commentsEnabled = true
    form.tagIds = []
  }

  async function publishArticle() {
    if (loading.value) return

    if (!form.title.trim() || !form.content.trim()) {
      modalResult.value = {
        status: 'error',
        message: 'Le titre et le contenu sont obligatoires.',
      }
      modalActive.value = true
      return
    }

    loading.value = true

    try {
      const response = await articlesApi.create({
        title: form.title.trim(),
        content: form.content.trim(),
        tagIds: form.tagIds,
      })

      modalResult.value = {
        status: 'success',
        article: {
          title: response.title,
          id: response.id,
          slug: response.slug,
        },
      }

      modalActive.value = true
    } catch (error: unknown) {
      modalResult.value = {
        status: 'error',
        message: getErrorMessage(error),
      }

      modalActive.value = true
    } finally {
      loading.value = false
    }
  }

  function keepDraft() {
    resetForm()
    modalActive.value = false
  }

  async function publishNow(articleId: string) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await articlesApi.publish(articleId)

      modalResult.value = {
        status: 'published',
        article: response,
      }

      resetForm()
    } catch (error: unknown) {
      modalResult.value = {
        status: 'error',
        message: getErrorMessage(error),
      }
    } finally {
      loading.value = false
    }
  }
</script>
<template>
  <section class="article-form">
    <form @submit.prevent="publishArticle">
      <header class="form-header">
        <div>
          <div class="form-actions">
            <h1 class="va-h4">Publier un article</h1>
            <VaButton type="submit" :loading="loading" :disabled="loading"> Publier </VaButton>
          </div>
          <p>Partagez vos connaissances et vos idées avec la communauté Duno-lab.</p>
        </div>
      </header>
      <div class="field">
        <label for="title">Titre</label>
        <VaInput
          id="title"
          v-model="form.title"
          class="input"
          placeholder="Donnez un titre à votre article"
          :disabled="loading"
          required
        />
      </div>

      <div class="field">
        <label for="tags">Tags</label>
        <TagSelectorCommon id="tags" v-model="form.tagIds" />
      </div>

      <div class="field">
        <label for="content">Contenu</label>
        <VaTextarea
          id="content"
          v-model="form.content"
          class="input"
          placeholder="Partagez vos connaissances, vos idées ou votre expérience..."
          :min-rows="12"
          :disabled="loading"
          required
        />
      </div>
    </form>
  </section>

  <DraftAlertCommon
    v-model:active="modalActive"
    :result="modalResult"
    :loading="loading"
    @publish="publishNow"
    @keep-draft="keepDraft"
  />
</template>

<style scoped>
  .article-form {
    width: 100%;
    min-width: 0;
  }

  .form-header {
    margin-bottom: 1.5rem;
  }

  .form-header h1 {
    margin: 0;
  }

  .form-header p {
    margin: 0.5rem 0 0;
    color: var(--va-secondary);
    line-height: 1.5;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }

  .input {
    width: 100%;
  }

  .form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 1.5rem;
  }
</style>
