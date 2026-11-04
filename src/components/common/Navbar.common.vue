<script setup lang="ts">
  import { indexValue, useNavStore } from '@/stores/nav.store'
  import { ArrowUpRight, Book, BookDashed, BookMarked, Telescope } from '@lucide/vue'

  const nav = useNavStore()
  const setNav = (param: indexValue) => nav.setIndex(param)
</script>

<template>
  <VaNavbar color="primary" class="nav">
    <template #left>
      <VaNavbarItem class="navbar-item-slot">
        <span class="va-h6">Dnw</span>
      </VaNavbarItem>
    </template>
    <template #right>
      <VaNavbarItem class="navbar-item-slot">
        <VaButton class="btn" size="small" text-color="#f4f4f4" @click="setNav(indexValue.article)">
          Explorer <Telescope :size="17" />
        </VaButton>
        <VaButton
          class="btn"
          size="small"
          text-color="#f4f4f4"
          @click="setNav(indexValue.article_form)"
        >
          Écrire <Book :size="17" />
        </VaButton>
        <VaButton
          class="btn"
          size="small"
          text-color="#f4f4f4"
          @click="setNav(indexValue.question)"
        >
          Question <Book :size="17" />
        </VaButton>
        <VaButton class="btn" size="small" text-color="#f4f4f4" @click="setNav(indexValue.draft)">
          Brouillon <BookDashed :size="17" />
        </VaButton>
        <VaButton
          class="btn"
          size="small"
          text-color="#f4f4f4"
          @click="setNav(indexValue.bookmark)"
        >
          Bookmark <BookMarked :size="17" />
        </VaButton>

        <VaButton class="btn" size="small" text-color="#f4f4f4" v-if="false">
          Connexion <ArrowUpRight :size="17" />
        </VaButton>
      </VaNavbarItem>
    </template>
  </VaNavbar>
</template>
<style scoped>
  *,
  .btn {
    color: #f4f4f4 !important;
  }
  .nav {
    padding: 5px 5%;
  }
  .navbar-item-slot {
    display: flex;
    gap: 1dvw;
  }
</style>
