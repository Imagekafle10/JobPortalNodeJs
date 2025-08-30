
import { createUser, findUserByEmail } from '../models/crud.js'
import { createJWT, comparePassword } from '../models/userModel.js';


export const registerController = async (req, res, next) => {
    try {
        const { name, email, password, lastName } = req.body;

        //validate
        if (!name) {
            next("Name is required");
        }
        if (!email) {
            next("Email is required");
        }
        if (!password) {
            next("Password is required");
        }

        // const existingUser = await findUserByEmail(email);

        // if (existingUser) {
        //     next("Email Already Existed");
        // }

        const user = await createUser({ name, email, password });

        const token = createJWT(user);

        res.status(201).send({
            success: true,
            message: "User Created Sucessfully",
            user: {
                id: user.id,
                name: name,
                email: email,
            },
            token
        })

    } catch (error) {
        next(error);

    }
}

export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //Validation
        if (!email || !password) {
            next("Please Provide all Fields")
        }

        //Find user By Email
        const user = await findUserByEmail(email);
        if (!user) {
            next("Invalid Username or Password")
        }

        //Compare Password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            next(("Invalid Username or Password"));
        }


        const token = createJWT(user);

        res.status(201).send({
            success: true,
            message: "Login Sucessfully",
            user: {
                id: user.id,
                email: email,
            },
            token
        })


    } catch (error) {
        console.log(error);

    }
}