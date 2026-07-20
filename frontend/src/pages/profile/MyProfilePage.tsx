import { useAuth } from "@/auth/useAuth"
import useUserProfile from "@/hooks/useUserProfile"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import likes from "../../assets/likes.png"
import vues from "../../assets/vues.png"
import edit from "../../assets/edit.png"
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
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import TagsForm from "@/components/tags-form"
import PhotosForm from "@/components/photos-form"
import { Switch } from "@/components/ui/switch"
import ProfileTab from "@/components/ProfileTab"
import type { UserProfile } from "@/types/user"

function MyProfilePage() {
    const { accessToken } = useAuth()
    const { profile } = useUserProfile()

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
            <ProfileTabs profile={profile!}/>
        </>
    )
}

export function ProfileTabs({profile} : {profile : UserProfile}) {
  return (
    <Tabs defaultValue="Profile" className="w-[400px]">
        <TabsList>
            <TabsTrigger value="Profile">Profile</TabsTrigger>
            <TabsTrigger value="account">account</TabsTrigger>
            <TabsTrigger value="notifications">notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="Profile">
            <ProfileTab profile={profile}/>
        </TabsContent>
        <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>account</CardTitle>
            <CardDescription>
              These are your personal secret informations.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <form>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="usernamer">Username</FieldLabel>
                        <Input id="username" name="username" type="text" disabled />
                        <button>{edit}</button>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="user-email">Email address</FieldLabel>
                        <Input id="user-email" name="user-email" type="email" disabled />
                        <button>{edit}</button>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="firstname">Firstname</FieldLabel>
                        <Input 
                            id="firstname"
                            name="firstname"
                            type="text"
                        />                        
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="lastname">Lastname</FieldLabel>
                        <Input 
                            id="lastname"
                            name="lastname"
                            type="text"
                        />                        
                    </Field>
                    <Field>
                        <FieldLabel>Reset your password</FieldLabel>
                        <button>{edit}</button>
                        <div>
                            <div>
                                <Label htmlFor="reset-pwd">Current password</Label>
                                <Input id="reset-pwd" name="reset-pwd" type="password"/>
                            </div>
                            <div>
                                <Label htmlFor="reset-pwd">New password</Label>
                                <Input id="reset-pwd" name="reset-pwd" type="password"/>
                            </div>
                            <div>
                                <Label htmlFor="reset-pwd">Confirm new password</Label>
                                <Input id="reset-pwd" name="reset-pwd" type="password"/>
                            </div>
                            <button>Reset</button>
                        </div>
                    </Field>
                </FieldGroup>
            </form>
          </CardContent>
        </Card>
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