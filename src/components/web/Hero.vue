<script setup lang="ts">
  import { imagePath } from '@/const/image.path'
  import { BookDashed, Search, Telescope } from '@lucide/vue'
</script>

<template>
  <section>
    <div class="content">
      <h3 class="va-h3">Build better. Together.</h3>
      <span>Des idées à partager. Des problèmes à résoudre. Des choses à construire ensemble.</span>
      <VaInput>
        <template #prependInner>
          <VaButton preset="plain" borderColor="transparent">
            <Search />
          </VaButton>
        </template>
      </VaInput>
      <div class="call">
        <VaButton>Explorer la communauté <Telescope :size="17" /> </VaButton>
        <VaButton>Publier un article <BookDashed :size="17" /></VaButton>
      </div>
    </div>
    <div class="img">
      <img :src="imagePath.Newspaper" width="650px" />
    </div>
  </section>
</template>
<style scoped>
  section {
    height: 70dvh;
    padding: 0 5%;
    display: flex;
  }
  .content {
    height: 100%;
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 1dvw;
  }
  .call {
    display: flex;
    gap: 1dvw;
  }
</style>
