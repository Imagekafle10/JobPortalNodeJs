import { findUserById, updateUser } from "../models/crud.js"
import { createJWT } from "../models/userModel.js"
export const updateUserController = async (req, res, next) => {
    const { name, email, location } = req.body

    if (!name || !email || !location) {
        next("Please Provide All Fields")
    }

    const user = await updateUser(req.user.userId, {
        name: name,
        email: email,
        location: location,
    });



    const token = createJWT(user);

    res.status(200).json({
        user,
        token,
    });




}


export const getUserController = async (req, res, next) => {
    try {
        const id = req.user.userId;



        const user = await findUserById(id)
        user.password = undefined


        if (!user) {
            return res.status(200).send({
                message: "User Not Found",
                sucess: false
            });
        } else {
            return res.status(200).send({
                success: true,
                data: user
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Auth Error",
            success: false,
            error: error.message
        })
    }
}