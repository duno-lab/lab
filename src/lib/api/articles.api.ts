import { api } from '@/lib/api/client'

export interface ArticleTag {
  id: string
  name: string
  slug: string
}

export interface ArticleAuthor {
  id: string
  username: string
  avatarUrl: string | null
}

export type ArticleStatus = 'DRAFT' | 'PUBLISHED'

export interface Article {
  id: string
  authorId: string
  title: string
  slug: string
  excerpt: string | null
  status: ArticleStatus
  publishedAt: string | null
  createdAt: string
  author: ArticleAuthor
  tags: ArticleTag[]
}

export interface CreateArticlePayload {
  title: string
  content: string
  tagIds?: string[]
}

export interface UpdateArticlePayload {
  title?: string
  content?: string
  tagIds?: string[]
}

export interface ArticleListQuery {
  page?: number
  limit?: number
  search?: string
  tag?: string
  sort?: string
}

export interface ArticlePagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ArticleListResponse {
  items: Article[]
  pagination: ArticlePagination
}

interface ArticleResponse {
  article: Article
}

const articlesApi = {
  /**
   * Liste les articles publiés avec pagination.
   */
  async list(params?: ArticleListQuery): Promise<ArticleListResponse> {
    const { data } = await api.get<ArticleListResponse>('/articles', {
      params,
    })

    return data
  },

  /**
   * Récupère un article par son slug.
   */
  async getBySlug(slug: string): Promise<Article> {
    const { data } = await api.get<ArticleResponse>(`/articles/${encodeURIComponent(slug)}`)

    return data.article
  },

  /**
   * Crée un article.
   */
  async create(payload: CreateArticlePayload): Promise<Article> {
    const { data } = await api.post<ArticleResponse>('/articles', payload)

    return data.article
  },

  /**
   * Modifie un article existant.
   */
  async update(id: string, payload: UpdateArticlePayload): Promise<Article> {
    const { data } = await api.patch<ArticleResponse>(
      `/articles/${encodeURIComponent(id)}`,
      payload
    )

    return data.article
  },

  /**
   * Publie un article enregistré en brouillon.
   */
  async publish(id: string): Promise<Article> {
    const { data } = await api.post<ArticleResponse>(`/articles/${encodeURIComponent(id)}/publish`)

    return data.article
  },

  /**
   * Supprime un article.
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/articles/${encodeURIComponent(id)}`)
  },
}

export default articlesApi
