<script setup lang="ts">
  import { computed } from 'vue'

  interface DraftArticle {
    id: string
    title: string
  }

  type ModalResult =
    | { status: 'success'; article: DraftArticle }
    | { status: 'error'; message: string }
    | { status: 'published'; article: DraftArticle }

  const props = defineProps<{
    active: boolean
    result: ModalResult | null
    loading?: boolean
  }>()

  const emit = defineEmits<{
    'update:active': [value: boolean]
    publish: [articleId: string]
    'keep-draft': []
  }>()

  const active = computed({
    get: () => props.active,
    set: (value: boolean) => emit('update:active', value),
  })
</script>

<template>
  <VaModal v-model="active" :hide-default-actions="true" max-width="480px">
    <div class="modal-content">
      <template v-if="result?.status === 'success'">
        <h6 class="va-h6">Article enregistré en brouillon</h6>

        <p>
          <strong>« {{ result.article.title }} »</strong> a bien été enregistré. Il n'est pas encore
          visible par les autres utilisateurs.
        </p>

        <p>
          Vous pouvez le garder dans vos brouillons pour le publier au moment de votre choix, ou le
          publier dès maintenant.
        </p>

        <div class="actions">
          <VaButton preset="secondary" :disabled="loading" @click="emit('keep-draft')">
            Garder en brouillon
          </VaButton>

          <VaButton
            :loading="loading"
            :disabled="loading"
            @click="emit('publish', result.article.id)"
          >
            Publier maintenant
          </VaButton>
        </div>
      </template>

      <template v-else-if="result?.status === 'published'">
        <h6 class="va-h6">Article publié</h6>
        <p>
          « {{ result.article.title }} » est maintenant publié et peut être consulté par les autres
          utilisateurs.
        </p>

        <div class="actions">
          <VaButton @click="active = false">Fermer</VaButton>
        </div>
      </template>

      <template v-else-if="result?.status === 'error'">
        <h6 class="va-h6">Impossible d'enregistrer l'article</h6>
        <p>{{ result.message }}</p>

        <div class="actions">
          <VaButton @click="active = false">Fermer</VaButton>
        </div>
      </template>
    </div>
  </VaModal>
</template>

<style scoped>
  .modal-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 8px 0;
  }

  .modal-content h6,
  .modal-content p {
    margin: 0;
  }

  .modal-content p {
    line-height: 1.6;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  }
</style>
