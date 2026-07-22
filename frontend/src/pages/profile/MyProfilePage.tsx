import useUserProfile from "@/users/useUserProfile"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import likes from "@/assets/likes.png"
import vues from "@/assets/vues.png"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import ProfileTab from "@/components/ProfileTab"
import type { UserProfile } from "@/types/user"
import AccountTab from "@/components/AccountTab"
import { useEffect, useState } from "react"
import * as usersApi from "@/api/users"
import { useAuth } from "@/auth/useAuth"
import { API_BASE_URL, ApiError } from "@/api/client"
import { resolveErrorMessage } from "@/i18n/errors"
import { FieldError } from "@/components/ui/field"

function MyProfilePage() {
    const { accessToken, logout } = useAuth()
    const { profile, error, fetchProfile } = useUserProfile()
    const [ avatar, setAvatar ] = useState<string | null>(null)
    const [serverError, setServerError] = useState<string | null>(null)

    useEffect(()=>{
        if (!accessToken)
            return
        const loadAvatar = async () => {
            try {
                const photos = await usersApi.getMyPhotos(accessToken!)
                const avatar_src = photos.filter(p=>p.is_profile_photo)[0].url
                setAvatar(avatar_src)
            } catch (err) {
                if (err instanceof ApiError) {
                    setServerError(resolveErrorMessage(err.code, err.message))
                    if (err.code === "USER_NOT_FOUND")
                        logout()
                }
            }
        }
        loadAvatar()
    }, [accessToken, logout])

    if (error) {
        return (
            <div>{error}</div>
        )
    }
    if (!profile) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <>
            <div>
                {serverError && <FieldError>{serverError}</FieldError>}
                <Avatar>
                    <AvatarImage src={`${API_BASE_URL}${avatar!}`} alt={profile?.username} />
                    <AvatarFallback>CN</AvatarFallback>
                    <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                </Avatar>
            </div>
            <div>
                <h1>user_name</h1>
                <div>
                    <p>
                        <img src={likes} alt="likes" className="w-5 h-5 object-cover rounded cursor-pointer"/>
                    </p>
                    <p>
                        <img src={vues} alt="vues" className="w-5 h-5 object-cover rounded cursor-pointer"/>
                    </p>
                </div>
            </div>
            <div>
                <p>Popularity</p>
            </div>
            <ProfileTabs profile={profile!} onSaved={fetchProfile}/>
        </>
    )
}

export function ProfileTabs({profile, onSaved} : {profile : UserProfile, onSaved: ()=>void}) {

    return (
        <Tabs defaultValue="Profile" className="w-[400px]">
            <TabsList>
                <TabsTrigger value="Profile">Profile</TabsTrigger>
                <TabsTrigger value="account">account</TabsTrigger>
            </TabsList>
            <TabsContent value="Profile">
                <ProfileTab profile={profile} onSaved={onSaved}/>
            </TabsContent>
            <TabsContent value="account">
                <AccountTab profile={profile} onSaved={onSaved}/>
            </TabsContent>
        </Tabs>
    )
}

export default MyProfilePage