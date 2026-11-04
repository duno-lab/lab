<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import NavbarCommon from './components/common/Navbar.common.vue'
</script>

<template>
  <section class="bloc">
    <NavbarCommon id="nav" />
    <div id="view">
      <section class="layout">
        <RouterView />
      </section>
    </div>
  </section>
</template>
<style scoped>
  #nav {
    position: fixed;
    top: 0;
    z-index: 1;
  }
  #view {
    position: fixed;
    top: 10dvh;
    height: 90dvh;
    overflow: scroll;
    width: 100%;
  }
</style>
