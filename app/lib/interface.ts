//Ya no es necesario

export enum AttemptStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED"
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: "USER" | "ADMIN"
  createdAt: Date

  attempts?: Attempt[]
}

export interface Question {
  id: string
  questionText: string
  topic: string
  createdAt: Date

  options?: Option[]
  attempts?: AttemptQuestion[]
  answers?: Answer[]
}

export interface Option {
  id: string
  text: string
  correct: boolean
  questionId: string

  question?: Question
  answers?: Answer[]
}

export interface Attempt {
  id: string
  userId: string
  topic: string
  status: AttemptStatus
  score?: number | null
  createdAt: Date

  user?: User
  answers?: Answer[]
  questions?: AttemptQuestion[]
}

export interface AttemptQuestion {
  id: string
  attemptId: string
  questionId: string

  attempt?: Attempt
  question?: Question
}

export interface Answer {
  id: string
  attemptId: string
  questionId: string
  selectedOptionId: string
  isCorrect: boolean
  createdAt: Date

  attempt?: Attempt
  question?: Question
  selectedOption?: Option
}
