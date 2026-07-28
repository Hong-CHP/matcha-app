import type { EditProfileValues } from "@/schemas/users"
import { useCallback, useState } from "react"
import type { UseFormSetValue } from "react-hook-form"

function useLocationInput(setValue: UseFormSetValue<EditProfileValues>){
    const [sharePosition, setSharePosition] = useState<boolean>(false)
    const [locationError, setLocationError] = useState<string | null> (null)
    const [isLocating, setIsLocating] = useState<boolean>(false)

    const handleEnableAutoLocation = useCallback(async ()=>{
        setLocationError(null)
        setIsLocating(true)
        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject)=>{
                navigator.geolocation.getCurrentPosition(resolve, reject)
            })
            const { latitude, longitude } = position.coords
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            )
            if (!res.ok)
                throw new Error(`Geocode failed: ${res.status}`)
            const data = await res.json()
            const locationText = data.display_name??""
            setValue("latitude", latitude)
            setValue("longitude", longitude)
            setValue("location_text", locationText)
            setSharePosition(true)
        } catch (err) {
            setLocationError("Could not get your location. Please enter it manually.")
            setSharePosition(false)
        } finally {
            setIsLocating(false)
        }
    }, [setValue])

    const handleManuallyLocationInput = useCallback(async(text: string)=> {
        if (!text.trim()) {
            setValue("latitude", null)
            setValue("longitude", null)          
            return
        }
        setLocationError(null)
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&limit=1`
            )
            if (!res.ok)
                throw new Error(`Geocode failed: ${res.status}`)
            const data = await res.json()
            if (data[0]) {
                setValue("location_text", text.trim())
                setValue("latitude", parseFloat(data[0].lat))
                setValue("longitude", parseFloat(data[0].lon))
            } else {
                setValue("latitude", null)
                setValue("longitude", null)
                setLocationError("No match for this address. Please try an valid address.")
                return
            }
        } catch (err) {
            setLocationError("Could not resolve this address.")
        }

    }, [setValue])

    const handleToggle = (checked: boolean) => {
        setSharePosition(checked)
        if (checked)
            handleEnableAutoLocation()
        else {
            setValue("latitude", null)
            setValue("longitude", null)
            setValue("location_text", "")         
        }
    }

    return {
        sharePosition,
        locationError,
        isLocating,
        handleToggle,
        handleManuallyLocationInput
    }
}

export default useLocationInput