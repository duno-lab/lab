<script setup lang="ts">
  import { ChevronDown, ChevronUp } from '@lucide/vue'
  import { computed, ref } from 'vue'

  interface Draft {
    id: string
    title: string
    content: string
    type: 'Article' | 'Question'
    tags: { id: string; name: string }[]
    updatedAt: string
  }

  const props = defineProps<{
    draft: Draft
  }>()

  const emit = defineEmits<{
    edit: [draft: Draft]
    delete: [id: string]
  }>()

  const expanded = ref(false)
  const showDeleteConfirmation = ref(false)

  const formattedDate = computed(() => {
    const date = new Date(props.draft.updatedAt)

    if (Number.isNaN(date.getTime())) return props.draft.updatedAt

    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)
  })
</script>

<template>
  <article class="draft">
    <VaCollapse class="collapse" v-model="expanded" header=" ">
      <template #header>
        <div class="header">
          <div class="info">
            <div class="metadata">
              <span class="type">{{ draft.type }}</span>
              <span class="date">Modifié le {{ formattedDate }}</span>
            </div>

            <h3>{{ draft.title || 'Sans titre' }}</h3>

            <div v-if="draft.tags.length" class="tags">
              <span v-for="tag in draft.tags" :key="tag.id" class="tag">
                {{ '#' + tag.name }}
              </span>
            </div>
          </div>

          <ChevronUp v-if="expanded" />
          <ChevronDown v-else />
        </div>
      </template>

      <div class="content">
        <p>{{ draft.content || 'Aucun contenu rédigé pour le moment.' }}</p>

        <div class="actions">
          <VaButton preset="primary" size="small" @click.stop="emit('edit', draft)">
            Reprendre
          </VaButton>

          <VaButton
            preset="secondary"
            color="danger"
            size="small"
            @click.stop="showDeleteConfirmation = true"
          >
            Supprimer
          </VaButton>
        </div>
      </div>
    </VaCollapse>

    <VaModal
      v-model="showDeleteConfirmation"
      title="Supprimer le brouillon"
      ok-text="Supprimer"
      cancel-text="Annuler"
      @ok="emit('delete', draft.id)"
    >
      <p>
        Voulez-vous vraiment supprimer « {{ draft.title || 'Sans titre' }} » ? Cette action est
        définitive.
      </p>
    </VaModal>
  </article>
</template>

<style scoped>
  .draft {
    border-bottom: 1px solid var(--va-background-border);
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.5rem 0;
  }

  .info {
    min-width: 0;
  }

  .metadata,
  .tags,
  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }

  .type,
  .date {
    color: var(--va-secondary);
    font-size: 0.8rem;
  }

  h3 {
    margin: 0.5rem 0;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }

  .content {
    padding: 0.5rem 0 1rem;
  }

  .content p {
    color: var(--va-secondary);
    line-height: 1.7;
    white-space: pre-line;
    overflow-wrap: anywhere;
  }

  .actions {
    margin-top: 1rem;
  }
</style>
