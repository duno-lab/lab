<script setup lang="ts">
  import { ref } from 'vue'
  import { loginWithGoogle } from '@/services/auth.service'
  import { ApiError } from '@/lib/api/api-error'
  import { imagePath } from '@/const/image.path'
  import router from '@/router'
  const loading = ref(false)
  const errorMessage = ref('')

  async function handleGoogleLogin() {
    errorMessage.value = ''
    loading.value = true

    try {
      await loginWithGoogle()
      await router.replace({
        name: 'user',
      })
      // Navigate to your authenticated page here,
      // using your existing Vue Router setup.
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        errorMessage.value = error.message
      } else {
        errorMessage.value = 'La connexion Google a échoué. Réessaie.'
      }
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <section>
    <div class="content">
      <h3 class="va-h3">Welcome Back</h3>
      <span>LOGIN PAGE</span>

      <div class="call">
        <VaButton @click="handleGoogleLogin">
          <img :src="imagePath.Google" />
          Se connecter avec Google
        </VaButton>
      </div>

      <div class="va-link-secondary">Conditions d’utilisation, Confidentialité et À propos</div>
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
  .va-link-secondary {
    font-size: 12px;
  }
  .content {
    height: 100%;
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    justify-content: center;
    gap: 1dvw;
  }
  .call {
    display: flex;
    gap: 1dvw;
  }
</style>
