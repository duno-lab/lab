import { api } from '@/lib/api/client'

export interface Tag {
  id: string
  name: string
  slug: string
}

interface TagsResponse {
  items: Tag[]
}

const tagsApi = {
  async list(): Promise<Tag[]> {
    const response = await api.get<TagsResponse | Tag[]>('/tags')

    return Array.isArray(response.data) ? response.data : response.data.items
  },
}

export default tagsApi
