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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Field, FieldGroup, FieldLabel, FieldTitle, FieldContent, FieldDescription, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
            <TabsContent value="notifications">
            <Card>
                <CardHeader>
                    <CardTitle>notifications</CardTitle>
                    <CardDescription>Manage your notification options.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                <FieldGroup className="w-full max-w-sm">
                    <FieldLabel htmlFor="switch-notifications">
                        <Field orientation="horizontal">
                            <FieldContent>
                                <FieldTitle>Enable notifications</FieldTitle>
                                <FieldDescription>
                                  Receive notifications when focus mode is enabled or disabled.
                                </FieldDescription>
                            </FieldContent>
                            <Switch id="switch-notifications" defaultChecked />
                        </Field>
                    </FieldLabel>
                    <FieldLabel htmlFor="switch-notif-likes">
                        <Field orientation="horizontal">
                            <FieldContent>
                                <FieldTitle>Enable notification "likes"</FieldTitle>
                                <FieldDescription>
                                  Receive notification "likes" when focus mode is enabled or disabled.
                                </FieldDescription>
                            </FieldContent>
                            <Switch id="switch-notif-likes" defaultChecked />
                        </Field>
                    </FieldLabel>
                    <FieldLabel htmlFor="switch-notif-messages">
                        <Field orientation="horizontal">
                            <FieldContent>
                                <FieldTitle>Enable notification "messages"</FieldTitle>
                                <FieldDescription>
                                  Receive notification "messages" when focus mode is enabled or disabled.
                                </FieldDescription>
                            </FieldContent>
                            <Switch id="switch-notif-messages" defaultChecked />
                        </Field>
                    </FieldLabel>
                </FieldGroup>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    )
}

export default MyProfilePage