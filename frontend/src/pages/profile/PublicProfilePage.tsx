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
    const {publicProfile, isLoading, serverError} = usePublicProfile(Number(userId))
    
    return (
        <>
            {isLoading && <p>Loading...</p>}
            {serverError && <FieldError>{serverError}</FieldError>}
            {publicProfile && (
                <div className="max-w-2xl mx-auto">
                    <div>
                        AVATAR
                        {/* <Avatar className="w-16 h-16 mx-auto">
                            <AvatarImage src={avatar ? `${API_BASE_URL}${avatar!}` : undefined} alt={profile?.username} />
                            <AvatarFallback>CN</AvatarFallback>
                            <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                        </Avatar> */}
                    </div>
                    <div className="flex flex-col">
                        <h1 className="m-auto">{publicProfile.first_name} {publicProfile.last_name}</h1>
                        <div className="flex flex-row justify-center gap-3">
                            <div className="flex flex-row items-center gap-1">
                                <p>10</p>
                                <img src={likes} alt="likes" className="w-5 h-5 object-cover rounded cursor-pointer"/>
                            </div>
                            <div className="flex flex-row items-center gap-1">
                                <p>10</p>
                                <img src={vues} alt="vues" className="w-5 h-5 object-cover rounded cursor-pointer"/>
                            </div>
                        </div>
                        <div className="flex flex-row justify-center gap-3">
                            <div className="flex flex-row items-center gap-1">
                                <p>{publicProfile.fame_rating}</p>
                                <p>Popularity</p>
                            </div>
                        </div>
                        <div>{publicProfile.gender}, {publicProfile.age} years old </div>
                        <div>Sexual preference: {publicProfile.sexual_preference}</div>
                        <div>Bio: {publicProfile.bio}</div>
                        <div>Location: {publicProfile.location_label}</div>
                        {!publicProfile.is_online && (<div>Last connection: {publicProfile.last_connection}</div>)}
                        <div>
                            <p>Tags:</p>
                            {publicProfile.tags?.map(tag=>(
                                <Badge key={tag.id}>{tag.name}</Badge>
                            ))}
                        </div>
                        <div>
                            <p>Gallery Photos</p>
                            {publicProfile.photos?.map(p=>(
                                <div key={p.id} style={{position: "relative"}}>
                                <img
                                    src={`${API_BASE_URL}${p.url}`}
                                    className="w-34 h-34 md:w-54 md:h-54 object-cover rounded cursor-pointer"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default PublicProfilePage