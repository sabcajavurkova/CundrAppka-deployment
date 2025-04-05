import User, { IUser } from '../models/users.model'

import bcrypt from 'bcrypt'
import { RequestHandler } from 'express'
import asyncHandler from 'express-async-handler'

// function for calculating user's age via birthday
const calculateAge = (birthDateString: string): number => {
    const birthDate = new Date(birthDateString)
    const diff = Date.now() - birthDate.getTime()
    const ageDate = new Date(diff)
    return Math.abs(ageDate.getUTCFullYear() - 1970)
}

// registers user to database
// @route POST /api/users/register
export const registerUser: RequestHandler<unknown, unknown, IUser, unknown> = async (req, res, next) => {    
    try {
        // retrieve info on user from body
        const { username, first_name, last_name, birthday, email  } = req.body
        const rawPassword = req.body.password

        // make sure that neither username or email is not already taken
        const usernameExists = await User.findOne({username: username}).exec()
        const emailExists = await User.findOne({email: email}).exec()

        // if something is taken, notify user
        if(emailExists){
            res.status(409).json({ success: false, message: "Uživatel s tímto emailem již existuje"})
            return
        }
        if(usernameExists){
            res.status(409).json({ success: false, message: "Uživatel s tímto username již existuje"})
            return
        }

        // generate unique salt and hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(rawPassword, salt)

        // create a new user instance with the provided data
        const newUser: IUser = await User.create({
            username: username,
            first_name: first_name,
            last_name: last_name,
            birthday: birthday,
            email: email,
            password: hashedPassword,
            age: calculateAge((birthday as unknown) as string)
        })

        // if successful send status 200 (success) and other data
        if (newUser) {
            res.status(200).json({
                success: true, 
                newUser: newUser
            })
        }
    } catch (error) {
        // if unsuccessful it is server's fault, therefore status 500 
        res.status(500).json({ success: false, message: "Registrace se nepodařila"})
    }
}

// define LoginBody
interface LoginBody {
    userInfo: string,
    password: string
}

// logging in user
// @route POST /api/users/login
export const loginUser: RequestHandler<unknown, unknown, LoginBody, unknown> = asyncHandler(async (req, res) => {
    try {
        // get userInfo (email or username) and passqord from request body
        const { userInfo, password } = req.body

        // try to find user by both email and username
        const user1 = await User.findOne({username: userInfo}).select('+email +password').exec()
        const user2 = await User.findOne({email: userInfo}).select('+username +password').exec()
        // pick the user that exists
        const user = user1 || user2
        // is user with such info doesnt exist send info to frontend
        if(!user){
            res.status(401).json({ success: false, message: "Tento uživatel neexistuje"})
            return
        }

        // compare hashed passwords
        const passwordMatch = await bcrypt.compare(password, user.password)

        // if they don't match let frontend know and return
        if(!passwordMatch){
            res.status(401).json({ success: false, message: "Nespravné heslo"})
            return
        }

        // store user ID in session = user is now logged in
        req.session.userId = user.id

        // if the code didn't fail until now it was successful
        res.status(200).json({user, success: true, message: "Prihlaseni probehlo uspesne"})
    } catch (error) {
        res.status(500).json({ success: false, message: "Prihlaseni se nepodarilo"})
    }
})

// logs out user
// @route POST /api/users/logout
export const logoutUser: RequestHandler = async (req, res, next) => {
    // removes the user's session = logging them out.
    req.session.destroy(error => {
        if(error){
            res.status(500).json({ success: false, message: "Odhlaseni se nepodarilo"})
        }
        else{
            // if there are no errors the log out was successful
            res.status(200).json({ success: true, message: "Byli jste odhlaseni"})
        }
    })
}

// fetches current user checks whether user is logged in or not
// @route GET /api/users
export const getUser: RequestHandler = async (req, res) => {
    try {
        // get the userId saved in user's session
        const authenticatedUserId = req.session.userId

        if(!authenticatedUserId){
            // if there is none, user is not logged in
            // the status is 200 because there was no error, the user is just not logged in
            res.status(200).json({success: false})
            // the function doesn't execute any further
            return
        }
        // if logged in, find the user based on ID and send it to frontend
        const user = await User.findById(authenticatedUserId).select('+email').exec()
        if (user) {
            res.status(200).json({user, success: true, message: `Jste prihlasen jako ${user!.username}`})
        }
    } catch (error) {
        res.status(500).json({success: false})
    }
}
