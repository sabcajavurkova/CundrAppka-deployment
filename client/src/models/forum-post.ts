// Post model

export interface Post {
    _id: string
    city: string
    title?: string // optional
    text: string
    full_name: string
    createdAt: string
}