<script setup lang="ts">
  import { computed } from 'vue'
  import type { Article } from '@/lib/api/articles.api'

  const props = defineProps<{
    article: Article
  }>()

  const formattedDate = computed(() => {
    const date = props.article.publishedAt ?? props.article.createdAt

    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date))
  })
</script>

<template>
  <article>
    <div class="info">
      <VaAvatar
        :src="article.author?.avatarUrl ?? undefined"
        :fallback-text="article.author?.username?.charAt(0).toUpperCase() ?? '?'"
        size="36px"
      />
      <span class="author">{{ article.author.username }}</span>
      <span class="date">{{ formattedDate }}</span>
    </div>

    <h6 class="title va-h6">{{ article.title }}</h6>

    <p class="content">
      {{ article.excerpt || 'Découvrez les idées partagées par la communauté.' }}
    </p>

    <div v-if="article.tags.length" class="tags">
      <span v-for="tag in article.tags" :key="tag.id" class="tag">
        {{ '#' + tag.name }}
      </span>
    </div>

    <VaDivider />
  </article>
</template>

<style scoped>
  article {
    width: 100%;
    max-width: 760px;
    text-align: left;
  }

  .info {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;
  }

  .author {
    font-weight: 600;
  }

  .date {
    color: var(--va-secondary);
    font-size: 0.85rem;
  }

  .title {
    margin: 0;
    font-size: 1.35rem;
    line-height: 1.4;
  }

  .content {
    margin: 16px 0;
    line-height: 1.7;
  }

  .tags,
  .action-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .tags {
    flex-wrap: wrap;
    margin-bottom: 16px;
  }

  .read-more {
    display: inline-block;
    margin-bottom: 16px;
  }

  .actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .actions > div {
    display: flex;
    gap: 8px;
  }
</style>
