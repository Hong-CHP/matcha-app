import useUserProfile from "@/users/useUserProfile"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import likes from "../../assets/likes.png"
import vues from "../../assets/vues.png"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import ProfileTab from "@/components/ProfileTab"
import type { UserProfile } from "@/types/user"
import AccountTab from "@/components/AccountTab"

function MyProfilePage() {
    const { profile, fetchProfile } = useUserProfile()

    return (
        <>
            <div>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                    <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                </Avatar>
            </div>
            <div>
                <h1>user_name</h1>
                <div>
                    <p>
                        <img src={likes} alt="likes" />
                    </p>
                    <p>
                        <img src={vues} alt="vues" />
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
                <TabsTrigger value="notifications">notifications</TabsTrigger>
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