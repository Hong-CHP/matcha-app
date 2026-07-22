import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldContent, FieldDescription, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import TagsForm from "@/components/tags-form"
import PhotosForm from "@/components/photos-form"
import type { UserProfile } from "@/types/user"
import { Controller } from "react-hook-form"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { editProfileSchema, type EditProfileValues } from "@/schemas/users"
import { zodResolver } from "@hookform/resolvers/zod"
import useProfileTags from "@/users/useProfileTags"
import useProfilePhotos from "@/users/useProfilePhotos"
import useLocationInput from "@/users/useLocationInput"
import { useAuth } from "@/auth/useAuth"
import * as usersApi from "../api/users"
import { ApiError } from "@/api/client"
import { resolveErrorMessage } from "@/i18n/errors"

function ProfileTab({profile, onSaved} : {profile : UserProfile, onSaved: ()=>void}) {
    const { accessToken, logout } = useAuth()
    const [editing, setEditing] = useState<boolean>(false)
    const [serverError, setServerError] = useState<string | null>(null)

    const {
        register,
        control,
        reset,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<EditProfileValues>({
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            age: profile.age!,
            gender: profile.gender as "male" | "female" | "other",
            sexual_preference: profile.sexual_preference as "man" | "woman" | "bisexual",
            bio: profile.bio!,
            latitude: profile.latitude,
            longitude: profile.longitude,
            location_text: profile.location_text ?? ""
        }
    })

    const {
        sharePosition,
        locationError,
        isLocating,
        handleToggle,
        handleManuallyLocationInput
    } = useLocationInput(setValue)

    const {
        inputValue,
        tagsSearchList,
        tagsList,
        serverError: tagsError,
        handleMyTags,
        handleInput,
        handleAddTag,
        handleDeleteTag, 
    } = useProfileTags()

    const {
        photoList,
        serverError: photosError,
        handleGetMyPhotos,
        handleAddPhoto,
        handleAsAvatar,
        handlePatchPhoto,
        handleDeletePhoto
    } = useProfilePhotos()

    const onSubmit = async (data: EditProfileValues)=> {
        setServerError(null)
        try {
            setEditing(false)
            await usersApi.editUserProfile(accessToken!, data)
            onSaved()
        } catch (err) {
            if (err instanceof ApiError) {
                setServerError(resolveErrorMessage(err.code, err.message))
                if (err.code === "USER_NOT_FOUND")
                    logout()
            }
        }
    }

    const handleCancel = () => {
        setServerError(null)
        reset(),
        setEditing(false)
    }

    return (
        <Card>
          <CardHeader>
            <div>
                <CardTitle>Profile</CardTitle>
                <CardDescription>These informations will be shown to public.</CardDescription>
            </div>
            <div>
                <Button onClick={()=>setEditing(true)}>Edit</Button>
            </div>
            {editing && (
                <div>
                    <Button onClick={handleSubmit(onSubmit)}>Save</Button>
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                </div>
            )}
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <form>
                {serverError && (<FieldError>{serverError}</FieldError>)}
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="age">Age</FieldLabel>
                        <Input id="age" type="number" disabled={!editing}
                            aria-invalid={!!errors.age}
                            {...register("age", {valueAsNumber: true})} />
                        <FieldError errors={[errors.age]}/>
                    </Field>
                    <Controller 
                        name="gender"
                        control={control}
                        render={({ field, fieldState })=>(
                            <Field>
                                <RadioGroup
                                    value={ field.value } onValueChange={field.onChange}>
                                    <p>Gender</p>
                                    <div>
                                        <RadioGroupItem value="male" id="male" />
                                        <Label htmlFor="male">Male</Label>
                                    </div>        
                                    <div>
                                        <RadioGroupItem value="female" id="female" />
                                        <Label htmlFor="female">Female</Label>
                                    </div>        
                                    <div>
                                        <RadioGroupItem value="other" id="other" />
                                        <Label htmlFor="other">Other</Label>
                                    </div>                    
                                </RadioGroup>
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                    )}/>
                    <Controller
                        name="sexual_preference"
                        control={control}
                        render={({field, fieldState})=>(
                        <Field>
                            <RadioGroup value={ field.value } onValueChange={field.onChange}>
                                <p>Sexual_preference</p>
                                    <div>
                                        <RadioGroupItem value="man" id="man" />
                                        <Label htmlFor="man">Man</Label>
                                    </div>        
                                    <div>
                                        <RadioGroupItem value="woman" id="woman" />
                                        <Label htmlFor="woman">Woman</Label>
                                    </div>        
                                    <div>
                                        <RadioGroupItem value="bisexual" id="bisexual" />
                                        <Label htmlFor="bisexual">Bisexual</Label>
                                    </div>     
                            </RadioGroup>
                            <FieldError errors={[fieldState.error]} />
                        </Field>
                    )} />
                    <Field>
                        <FieldLabel htmlFor="user_bio">Bio: </FieldLabel>
                        <textarea id="user_bio" disabled={!editing}
                            placeholder="Please describe yourself..."
                            aria-invalid={!!errors.bio}
                            {...register('bio')} />
                        <FieldError errors={[errors.bio]} />
                    </Field>
                    <Field>
                        <FieldContent>
                            <FieldLabel htmlFor="switch-position-mode">Share your localisation</FieldLabel>
                            <FieldDescription>
                              Share your localisation permisses a good match, otherwise, please entre manually your position.
                            </FieldDescription>
                            <Switch
                                id="switch-position-mode"
                                checked={sharePosition}
                                onCheckedChange={handleToggle}
                                disabled={!editing}/>
                            {isLocating && (<p>Getting your location...</p>)}
                            {!sharePosition && (
                                <Input id="location_text" type="text" disabled={!editing}
                                {...register("location_text", {
                                    onChange: (e)=>handleManuallyLocationInput(e.target.value)
                                })} />
                            )}
                            {locationError && (<FieldError>{locationError}</FieldError>)}
                            <FieldError errors={[errors.location_text]}/>
                        </FieldContent>
                    </Field>
                </FieldGroup>
                <TagsForm
                    inputValue = {inputValue}
                    tagsSearchList = {tagsSearchList}
                    tagsList = {tagsList}
                    serverError = {tagsError}
                    handleMyTags = {handleMyTags}
                    handleInput = {handleInput}
                    handleAddTag = {handleAddTag}
                    handleDeleteTag = {handleDeleteTag}
                    showNextStep = {false}
                />
                <PhotosForm
                    photoList = {photoList}
                    serverError = {photosError}
                    handleGetMyPhotos = {handleGetMyPhotos}
                    handleAddPhoto = {handleAddPhoto}
                    handleAsAvatar = {handleAsAvatar}
                    handlePatchPhoto = {handlePatchPhoto}
                    handleDeletePhoto = {handleDeletePhoto}
                    showFinish = {false}
                />
            </form>
          </CardContent>
        </Card>
    )
}

export default ProfileTab