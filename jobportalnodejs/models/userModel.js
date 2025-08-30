import bcrypt from "bcryptjs";
import JWT from 'jsonwebtoken';

//Middleware
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}


//Compare Password
async function comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}


//Json Web Token
function createJWT(user) {
    return JWT.sign(
        { userId: user.id, email: user.email }, // payload
        process.env.JWT_SECRET,                 // secret key
        { expiresIn: "1d" }                     // options
    );
}

export { hashPassword, createJWT, comparePassword }