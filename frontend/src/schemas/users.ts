import { z } from 'zod'

export const profileSchema = z.object({
    age: z.number().min(18, "You must be at least 18").max(100),
    gender: z.enum(["male", "female", "other"]),
    sexual_preference: z.enum(["man", "woman", "bisexual"]),
    bio: z.string().min(1, "Bio is required"),
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

export type ProfileValues = z.infer<typeof profileSchema>
export type EditProfileValues = z.infer<typeof editProfileSchema>
