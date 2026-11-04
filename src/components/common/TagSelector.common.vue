<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import tagsApi, { type Tag } from '@/lib/api/tag.api'

  const props = defineProps<{
    modelValue: string[]
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string[]]
  }>()

  const tags = ref<Tag[]>([])
  const loading = ref(false)
  const errorMessage = ref('')

  const selectedTagIds = computed({
    get: () => props.modelValue,
    set: (value: string[]) => emit('update:modelValue', value),
  })

  onMounted(async () => {
    loading.value = true
    errorMessage.value = ''

    try {
      tags.value = await tagsApi.list()
    } catch {
      errorMessage.value = 'Impossible de charger les tags.'
    } finally {
      loading.value = false
    }
  })
</script>

<template>
  <div class="tag-selector">
    <VaSelect
      v-model="selectedTagIds"
      :options="tags"
      text-by="name"
      value-by="id"
      placeholder="Sélectionnez un ou plusieurs tags"
      multiple
      searchable
      :loading="loading"
      :disabled="loading || tags.length === 0"
      clearable
    />

    <p v-if="errorMessage" class="error">
      {{ errorMessage }}
    </p>

    <p v-else class="hint">Choisissez les tags qui décrivent le mieux votre contenu.</p>
  </div>
</template>

<style scoped>
  .tag-selector {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .hint,
  .error {
    margin: 0;
    font-size: 0.875rem;
  }

  .hint {
    color: var(--va-secondary);
  }

  .error {
    color: var(--va-danger);
  }
</style>
