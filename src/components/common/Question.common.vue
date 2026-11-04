<script setup lang="ts">
  import { computed } from 'vue'
  import type { Question } from '@/lib/api/question.api'
  import { RouterLink } from 'vue-router'
  const props = defineProps<{
    question: Question
  }>()

  const formattedDate = computed(() => {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
    }).format(new Date(props.question.createdAt))
  })
</script>

<template>
  <RouterLink
    :to="{ name: 'question-detail', params: { slug: question.slug } }"
    class="question-link"
  >
    <article class="question">
      <div class="author">
        <VaAvatar
          :src="question.author?.avatarUrl ?? undefined"
          :fallback-text="question.author?.username?.charAt(0).toUpperCase() ?? '?'"
          size="36px"
        />

        <div class="author-info">
          <span class="username">
            {{ question.author?.username ?? 'Utilisateur inconnu' }}
          </span>

          <span class="date">
            {{ formattedDate }}
          </span>
        </div>

        <span class="status" :class="{ resolved: question.isResolved }">
          {{ question.isResolved ? 'Résolue' : 'Ouverte' }}
        </span>
      </div>

      <h6 class="title">
        {{ question.title }}
      </h6>

      <p class="content">
        {{ question.content }}
      </p>

      <div class="footer">
        <div class="tags">
          <span v-for="tag in question.tags" :key="tag.id" class="tag">
            {{ '#' + tag.name }}
          </span>
        </div>

        <span class="answers">
          {{ question.answerCount }}
          {{ question.answerCount > 1 ? 'réponses' : 'réponse' }}
        </span>
      </div>
      <VaDivider />
    </article>
  </RouterLink>
</template>

<style scoped>
  .question {
    width: 100%;
  }
  .author {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .author-info {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .username {
    font-size: 0.9rem;
    font-weight: 600;
  }

  .date {
    color: var(--va-secondary);
    font-size: 0.8rem;
  }

  .status {
    margin-left: auto;
    padding: 4px 8px;
    border-radius: 4px;
    background: var(--va-background-element);
    font-size: 0.75rem;
  }

  .status.resolved {
    color: var(--va-success);
  }

  .title {
    margin: 16px 0 8px;
    display: inline-block;
    font-size: 1.15rem;
    font-weight: 600;
  }

  .content {
    margin: 0;
    color: var(--va-secondary);
    line-height: 1.6;
    white-space: pre-line;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 16px;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .answers {
    color: var(--va-secondary);
    font-size: 0.85rem;
  }

  .question-link {
    display: block;
    color: inherit;
    text-decoration: none;
    cursor: pointer;
    width: 100%;
  }

  .question-link:hover .title {
    color: var(--va-primary);
  }

  .question {
    transition: background-color 0.2s ease;
  }
</style>
