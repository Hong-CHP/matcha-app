import { z } from 'zod'
import { passwordSchema } from './auth'

export const profileSchema = z.object({
    age: z.number().min(18, "You must be at least 18").max(100),
    gender: z.enum(["male", "female", "other"]),
    sexual_preference: z.enum(["man", "woman", "bisexual"]),
    bio: z.string().trim().min(1, "Bio is required"),
})

export const editProfileSchema = profileSchema.extend({
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    location_text: z.string().nullable()
}).refine(
    (data) => 
        data.latitude !== null && 
        data.longitude !== null &&
        !!data.location_text &&
        data.location_text.trim().length > 0,
    {
        path: ["location_text"],
        message: "Please enter your location manually or enable location sharing."
    }
)

export const accountSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
})

export const passwordchangeSchema = z.object({
    current_password: passwordSchema,
    new_password: passwordSchema,
    confirm_password: passwordSchema,
}).refine(
    (data) =>
        data.confirm_password === data.new_password,
    {
        path: ["confirm_password"],
        message: "Your passwords are not the same."
    }
)

export type ProfileValues = z.infer<typeof profileSchema>
export type EditProfileValues = z.infer<typeof editProfileSchema>
export type AccountValues = z.infer<typeof accountSchema>
export type PasswordChangeValues = z.infer<typeof passwordchangeSchema>