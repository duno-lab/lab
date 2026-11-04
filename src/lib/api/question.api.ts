import { api } from '@/lib/api/client'

export interface QuestionAuthor {
  id: string
  username: string
  avatarUrl: string | null
}

export interface QuestionTag {
  id: string
  name: string
  slug: string
}

export interface Question {
  id: string
  authorId: string
  author: QuestionAuthor | null
  title: string
  slug: string
  content: string
  status: 'OPEN' | 'CLOSED'
  isResolved: boolean
  answerCount: number
  tags: QuestionTag[]
  createdAt: string
  updatedAt: string
}

export interface CreateQuestionPayload {
  title: string
  content: string
  tagIds?: string[]
}

export interface UpdateQuestionPayload {
  title?: string
  content?: string
  tagIds?: string[]
}

export interface QuestionListQuery {
  page?: number
  limit?: number
  search?: string
  tag?: string
  status?: string
  sort?: string
}

export interface QuestionListResponse {
  items: Question[]
  total?: number
  page?: number
  limit?: number
  totalPages?: number
}

interface QuestionResponse {
  item: Question
}

interface QuestionStatusResponse {
  message: string
  question: Question
}

const questionsApi = {
  async list(params?: QuestionListQuery) {
    const { data } = await api.get<QuestionListResponse>('/questions', {
      params,
    })

    return data
  },

  async getBySlug(slug: string) {
    const { data } = await api.get<QuestionResponse>(`/questions/${encodeURIComponent(slug)}`)

    return data.item
  },

  async create(payload: CreateQuestionPayload) {
    const { data } = await api.post<QuestionResponse>('/questions', payload)

    return data.item
  },

  async update(id: string, payload: UpdateQuestionPayload) {
    const { data } = await api.patch<QuestionResponse>(
      `/questions/${encodeURIComponent(id)}`,
      payload
    )

    return data.item
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/questions/${encodeURIComponent(id)}`)
  },

  async setResolution(id: string, isResolved: boolean) {
    const { data } = await api.patch<QuestionStatusResponse>(
      `/questions/${encodeURIComponent(id)}/resolve`,
      { isResolved }
    )

    return data.question
  },

  async setStatus(id: string, status: string) {
    const { data } = await api.patch<QuestionStatusResponse>(
      `/questions/${encodeURIComponent(id)}/status`,
      { status }
    )

    return data.question
  },


}

export default questionsApi
