<script setup lang="ts">
  import { ref } from 'vue'
  import DraftItemCommon from '../common/DraftItem.common.vue'

  const drafts = ref([
    {
      id: '1',
      title: 'Pourquoi TypeScript est incontournable',
      content: 'Une réflexion sur le typage et la maintenabilité du code...',
      type: 'Article' as const,
      tags: [
        { id: 't1', name: 'TypeScript' },
        { id: 't2', name: 'Développement web' },
      ],
      updatedAt: '2026-10-25T14:30:00',
    },
  ])

  function editDraft(draft: (typeof drafts.value)[number]) {
    // Rediriger vers le formulaire de modification du brouillon.
    console.log('Modifier :', draft.id)
  }

  async function deleteDraft(id: string) {
    // Appeler ici l'API de suppression.
    // Retirer le brouillon de la liste uniquement après succès.
    drafts.value = drafts.value.filter((draft) => draft.id !== id)
  }
</script>

<template>
  <section class="layout">
    <header class="header">
      <div>
        <span class="eyebrow">MON ESPACE / CONTENUS</span>
        <h1 class="va-h4">Mes brouillons</h1>
        <p>Retrouvez vos contenus en cours de rédaction.</p>
      </div>

      <span class="count">{{ drafts.length }} brouillon(s)</span>
    </header>

    <div v-if="drafts.length" class="drafts">
      <DraftItemCommon
        v-for="draft in drafts"
        :key="draft.id"
        :draft="draft"
        @edit="editDraft"
        @delete="deleteDraft"
      />
    </div>

    <p v-else class="empty">Aucun brouillon pour le moment.</p>
  </section>
</template>

<style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 2rem;
    width: 100%;
  }

  .eyebrow,
  .header p,
  .count {
    color: var(--va-secondary);
    font-size: 0.85rem;
  }

  .drafts {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .empty {
    padding: 2rem 0;
    color: var(--va-secondary);
    text-align: center;
  }

  @media (max-width: 600px) {
    .header {
      flex-direction: column;
    }
  }
</style>
