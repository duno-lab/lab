<script setup lang="ts">
  import type { Answer } from '@/lib/api/answers.api'
  import { ThumbsDown, ThumbsUp } from '@lucide/vue'

  defineProps<{
    answer: Answer
  }>()

  function formatDate(date: string) {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(date))
  }
</script>

<template>
  <article class="answer">
    <header class="answer__header">
      <VaAvatar
        :src="answer.author?.avatarUrl ?? undefined"
        :fallback-text="answer.author?.username?.charAt(0).toUpperCase() ?? '?'"
        size="40px"
      />

      <div class="answer__author">
        <strong>
          {{ answer.author?.username ?? 'Utilisateur inconnu' }}
        </strong>

        <span>{{ formatDate(answer.createdAt) }}</span>
      </div>

      <VaSpacer />

      <span class="point"> {{ answer.score }} point{{ answer.score > 1 ? 's' : '' }} </span>
    </header>

    <div class="answer__content">
      {{ answer.content }}
    </div>

    <footer class="answer__votes">
      <span>
        <ThumbsUp :size="17" />
        {{ answer.upvotes }}
      </span>

      <span>
        <ThumbsDown :size="17" />
        {{ answer.downvotes }}
      </span>
    </footer>
  </article>
</template>

<style scoped>
  .answer {
    padding: 1.25rem 0;
    border-bottom: 1px solid var(--va-background-border);
  }

  .answer__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .answer__author {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .answer__author strong {
    font-size: 0.95rem;
  }

  .answer__author span {
    color: var(--va-secondary);
    font-size: 0.8rem;
  }

  .answer__content {
    margin: 1rem 0;
    line-height: 1.7;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .answer__votes {
    display: flex;
    gap: 1rem;
    color: var(--va-secondary);
    font-size: 0.85rem;
  }

  .answer__votes span {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }
</style>
