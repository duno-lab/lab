<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import ArticleCommon from '@/components/common/Article.common.vue'
  import articlesApi, { type Article } from '@/lib/api/articles.api'

  const articles = ref<Article[]>([])
  const loading = ref(false)
  const errorMessage = ref('')

  async function loadHomeFeed() {
    loading.value = true
    errorMessage.value = ''

    try {
      const result = await articlesApi.list({
        page: 1,
        limit: 10,
        sort: 'newest',
      })

      articles.value = result.items
    } catch {
      errorMessage.value = 'Impossible de charger les articles.'
    } finally {
      loading.value = false
    }
  }

  onMounted(loadHomeFeed)
</script>

<template>
  <main class="home-page">
    <section class="feed">
      <header class="feed-header">
        <div>
          <h2 class="va-h4">Derniers articles</h2>
          <p class="feed-description">Découvrez les idées et les expériences de la communauté.</p>
        </div>
      </header>

      <div v-if="loading" class="message">Chargement des articles...</div>

      <div v-else-if="errorMessage" class="message">
        <p>{{ errorMessage }}</p>
        <VaButton preset="secondary" @click="loadHomeFeed"> Réessayer </VaButton>
      </div>

      <div v-else-if="articles.length === 0" class="message">
        Aucun article publié pour le moment.
      </div>

      <div v-else class="article-list">
        <ArticleCommon v-for="article in articles" :key="article.id" :article="article" />
      </div>
    </section>
  </main>
</template>

<style scoped>
  .home-page {
    width: 100%;
    min-width: 0;
  }

  .hero {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.25rem;
    padding-bottom: 2rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid var(--va-background-border);
  }

  .hero h1 {
    margin: 0;
  }

  .hero-description,
  .feed-description {
    margin: 0.5rem 0 0;
    line-height: 1.6;
    color: var(--va-secondary);
  }

  .feed-header {
    margin-bottom: 1.25rem;
  }

  .feed-header h2 {
    margin: 0;
  }

  .article-list {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .message {
    padding: 2rem 1rem;
    text-align: center;
  }

  @media (max-width: 600px) {
    .hero {
      padding-bottom: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .hero-actions {
      width: 100%;
    }
  }
</style>
