export type UserProfile = {
    id: number
    email: string
    username: string
    first_name: string
    last_name: string
    is_verified: boolean
    created_at: string
    gender: string | null
    sexual_preference: string | null
    age: number | null
    bio: string | null
    is_profile_completed: boolean
    latitude: number | null
    longitude: number | null
    location_label: string | null
    location_consent: boolean
    last_connection: string
}

export type Tag = {
    id: number
    name: string
}

export type TagInput = {
    name: string
}

export type Photo = {
    id: number
    url: string
    is_profile_photo: boolean
}

export type PublicProfile = {
    id: number
    username: string
    first_name: string
    last_name: string
    gender: string | null
    sexual_preference: string | null
    age: number | null
    bio: string | null
    fame_rating: number
    location_label: string | null
    last_connection: string
    is_online: boolean
    tags: Tag[]
    photos: Photo[]
}