import { api } from '@/lib/api/client'
import type { QuestionAuthor } from '@/lib/api/question.api'

export interface Answer {
  id: string
  questionId: string
  authorId: string
  author: QuestionAuthor | null
  content: string
  createdAt: string
  updatedAt: string
  upvotes: number
  downvotes: number
  score: number
  myVote: 'UP' | 'DOWN' | null
}

export interface AnswersListResponse {
  items: Answer[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface AnswerResponse {
  item: Answer
}

const answersApi = {
  async list(
    questionId: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<AnswersListResponse> {
    const { data } = await api.get<AnswersListResponse>(
      `/questions/${encodeURIComponent(questionId)}/answers`,
      { params }
    )

    return data
  },

  async create(questionId: string, content: string): Promise<Answer> {
    const { data } = await api.post<AnswerResponse>(
      `/questions/${encodeURIComponent(questionId)}/answers`,
      { content }
    )

    return data.item
  },
}

export default answersApi
