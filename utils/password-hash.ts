import bcrypt from "bcrypt"
const hashPassword = async (password:string) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}

const comparePassword = async (password:string, hashedPassword:string) => {
    return await bcrypt.compare(password, hashedPassword)
}

export {
    hashPassword,
    comparePassword
}