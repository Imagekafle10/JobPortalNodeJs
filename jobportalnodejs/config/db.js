import 'dotenv/config';
import mysql from "mysql2/promise";
import colors from 'colors';

let conn;

async function getConn() {
    if (!conn) {
        try {
            conn = await mysql.createConnection({
                host: process.env.LOCALHOST,
                user: process.env.USER,
                password: process.env.PASSWORD,
                database: process.env.DATABASE
            }); 
            console.log("Sql Connected".bgMagenta);
        } catch (error) {
            console.log(`Sql Error ${error}`.bgRed.white);
        }
    }
    return conn;
}

export default getConn;
