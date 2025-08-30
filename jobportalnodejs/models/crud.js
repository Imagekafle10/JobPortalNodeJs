import getConn from '../config/db.js';  // your connection file
import { hashPassword } from './userModel.js';

async function findUserByEmail(email) {
    try {
        const conn = await getConn();
        const [rows] = await conn.execute(
            "SELECT * FROM usermodel WHERE email = ? LIMIT 1",
            [email]
        );
        return rows.length > 0 ? rows[0] : null;  // like Mongoose findOne
    } catch (err) {
        console.error("SQL Error:", err);
        throw err;
    }
}


// create new user
async function createUser({ name, email, password }) {
    try {
        const conn = await getConn();

        const hashedPassword = await hashPassword(password);
        const [result] = await conn.execute(
            `INSERT INTO usermodel (name, email, password)
             VALUES (?, ?, ?)`,
            [name, email, hashedPassword]
        );
        return { id: result.insertId, name, email, hashedPassword };
    } catch (err) {
        console.error("SQL Error:", err);
        throw err;
    }
}



async function updateUser(userId, { name, email, location }) {
    const conn = await getConn();

    const [result] = await conn.execute(
        `UPDATE usermodel 
         SET name = ?, email = ?, location = ?
         WHERE id = ?`,
        [name, email, location, userId]
    );

    if (result.affectedRows === 0) {
        throw new Error("User not found");
    }

    // Fetch updated user
    const [rows] = await conn.execute(
        `SELECT id, name, email, lastName, location FROM usermodel WHERE id = ?`,
        [userId]
    );

    return rows[0];
}


async function findUserById(id) {
    try {
        const conn = await getConn();
        const [rows] = await conn.execute("Select *from UserModel where id = ?",
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.log(error);
        return null;

    }
}

export { findUserByEmail, createUser, updateUser, findUserById };
