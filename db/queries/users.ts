import dbConnection from "../connect"
import userModel from "../models/users"

interface createUserParams {
    username: string,
    email: string,
    password: string,
}

interface updateUserParams {
    username?: string,
}

const createUser = async ({ username, email, password }: createUserParams) => {
    try {
        await dbConnection()
        const model = new userModel({
            username,
            email,
            password
        })
        return await model.save()
    } catch (err) {
        console.log(err)
    }
}

const getUser = async (userId: string) => {
    try {
        await dbConnection()
        return await userModel.findById({ _id: userId })
    } catch (err) {
        console.log(err)
    }
}

const getUserByEmail = async (email: string) => {
    try {
        await dbConnection()
        return await userModel.findOne({ email })
    } catch (err) {
        console.log(err)
    }
}

export {
    createUser,
    getUser,
    getUserByEmail
}