export type StudyStatus = 'known' | 'unknown' | 'review'
export interface Subject { id: string; name: string; position: number }
export interface Topic { id: string; subjectId: string; name: string; position: number }
export interface User { id: string; username: string; className: string; field: string; avatarUrl: string | null }
export interface Card {
  id: string; topicId: string; theme: string; question: string; answer: string
  type: 'text' | 'code' | 'image' | 'choice'; extra: Record<string, unknown>
  status: StudyStatus | 'unseen'
}
export interface Progress { cardId: string; status: StudyStatus; updatedAt: string }
export interface Activity { day: string; attempts: number; xp: number }
export interface SaveProgressInput { attemptId: string; cardId: string; status: StudyStatus }
export interface SaveProgressResult extends SaveProgressInput { xpAwarded: number; duplicate: boolean }
