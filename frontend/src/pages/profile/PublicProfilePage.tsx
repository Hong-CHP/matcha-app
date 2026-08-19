import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FieldError } from "@/components/ui/field"
import { usePublicProfile } from "@/users/usePublicProfile"
import { useParams } from "react-router-dom"
import likes from "@/assets/likes.png"
import vues from "@/assets/vues.png"
import { API_BASE_URL } from "@/api/client"
import { Badge } from "@/components/ui/badge"

function PublicProfilePage() {
    const { userId } = useParams()
    const {publicProfile, profileAvatar, isLoading, serverError} = usePublicProfile(Number(userId))

    return (
        <>
            {isLoading && <p>Loading...</p>}
            {serverError && <FieldError>{serverError}</FieldError>}
            {publicProfile && (
                <div className="max-w-2xl mx-auto">
                    <div>
                        <Avatar className="w-16 h-16 mx-auto">
                            <AvatarImage src={profileAvatar ? `${API_BASE_URL}${profileAvatar!}` : undefined} alt={publicProfile?.username} />
                            <AvatarFallback>CN</AvatarFallback>
                            <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                        </Avatar>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="m-auto">{publicProfile.first_name} {publicProfile.last_name}</h1>
                        <div className="flex flex-row justify-center gap-3">
                            <div className="flex flex-row items-center gap-1">
                                <p>{publicProfile.likes_received_count ?? 0}</p>
                                <img src={likes} alt="likes" className="w-5 h-5 object-cover rounded cursor-pointer"/>
                            </div>
                            <div className="flex flex-row items-center gap-1">
                                <p>{publicProfile.visitors_count ?? 0}</p>
                                <img src={vues} alt="vues" className="w-5 h-5 object-cover rounded cursor-pointer"/>
                            </div>
                        </div>
                        <div className="flex flex-row justify-center gap-3">
                            <div className="flex flex-row items-center gap-1">
                                <p>{publicProfile.fame_rating}</p>
                                <p>Popularity</p>
                            </div>
                        </div>
                        <div className="my-4 mx-8 sm:px-8">
                            <div>{publicProfile.gender}</div>
                            <div>{publicProfile.age} years old</div>
                            <div>Preference: {publicProfile.sexual_preference}</div>
                            <div>Bio: {publicProfile.bio}</div>
                            <div>Location: {publicProfile.location_label}</div>
                            {!publicProfile.is_online && (<div>Last connection: {publicProfile.last_connection?? "Never"}</div>)}
                            <div>
                                <p>Tags:
                                {publicProfile.tags?.map(tag=>(
                                    <Badge
                                        key={tag.id}
                                        className="ml-1"
                                    >{tag.name}</Badge>
                                ))}
                                </p>
                            </div>
                            <div className="my-4">
                                <p>Gallery Photos</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                    {publicProfile.photos?.map(p=>(
                                        <div key={p.id} className="w-full aspect-square">
                                        <img
                                            src={`${API_BASE_URL}${p.url}`}
                                            className="w-full h-full object-cover rounded cursor-pointer"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default PublicProfilePage