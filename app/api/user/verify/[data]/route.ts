import { getUser } from "@/db/queries/users"
import { decryptData } from "@/utils/encryption"

const GET = async (request: Request) => {
    try {
        const urlData = request.url.split("/")
        const encryptedData = urlData[urlData.length - 1]
        console.log(encryptedData)
        const decryptedData = decryptData(encryptedData)
        console.log(decryptedData)
        const user = await getUser(decryptedData)
        let responseCode = "true"
        if (!user) {
            responseCode = "not_found"
            return Response.redirect(`http://localhost:3000/login?email_verified=${responseCode}`)
        }
        if(user.email_verified){
            responseCode = 'already_verified'
            return Response.redirect(`http://localhost:3000/login?email_verified=${responseCode}`)
        }
        user.email_verified = true
        user.email_verified_timestamp = new Date()
        await user.save()
        return Response.redirect(`http://localhost:3000/login?email_verified=${responseCode}`)
    }
    catch (err) {
        console.log(err)
        return Response.redirect("http://localhost:3000/login?email_verified=error")
    }
}


export { GET }