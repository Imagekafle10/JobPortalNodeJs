import getConn from "../config/db.js";
import moment from "moment";

export async function createJob({ company, position, status, workType, workLocation, createdBy }) {
    const conn = await getConn();

    // Set defaults if fields are missing
    const jobStatus = status;
    const jobWorkType = workType;
    const jobWorkLocation = workLocation

    const [result] = await conn.execute(
        `INSERT INTO jobs (company, position, status, workType, workLocation, createdBy)
     VALUES (?, ?, ?, ?, ?, ?)`,
        [company, position, jobStatus, jobWorkType, jobWorkLocation, createdBy]
    );

    // Return the inserted job
    const [rows] = await conn.execute(
        `SELECT * FROM jobs WHERE id = ?`,
        [result.insertId]
    );

    return rows[0];
}

// import db from "../config/db.js";

// Model
export async function getAllJobsModels({ status, workType, search, sort, createdBy, limit, offset }) {
    const conn = await getConn();
    let sql = "SELECT * FROM jobs WHERE createdBy = ?";
    let values = [createdBy];

    // filtering
    if (status && status !== "all") {
        sql += " AND status = ?";
        values.push(status);
    }

    if (workType && workType !== "all") {
        sql += " AND workType = ?";
        values.push(workType);
    }

    if (search) {
        sql += " AND position LIKE ?";
        values.push(`%${search}%`);  //partial/matching anywhere in the string
    }

    // sorting
    if (sort === "latest") {
        sql += " ORDER BY createdAt DESC";
    } else if (sort === "oldest") {
        sql += " ORDER BY createdAt ASC";
    } else if (sort === "a-z") {
        sql += " ORDER BY position ASC";
    } else if (sort === "z-a") {
        sql += " ORDER BY position DESC";
    }

    // add pagination
    sql += ` LIMIT ${limit} OFFSET ${offset}`;


    // fetch paginated jobs
    const [rows] = await conn.execute(sql, values);

    // count total jobs (without limit/offset)
    let countSql = "SELECT COUNT(*) as count FROM jobs WHERE createdBy = ?";
    let countValues = [createdBy];

    if (status && status !== "all") {
        countSql += " AND status = ?";
        countValues.push(status);
    }

    if (workType && workType !== "all") {
        countSql += " AND workType = ?";
        countValues.push(workType);
    }

    if (search) {
        countSql += " AND position LIKE ?";
        countValues.push(`%${search}%`);
    }



    const [countRows] = await conn.execute(countSql, countValues);
    const totalJobs = countRows[0].count;

    return { jobs: rows, totalJobs };
}





export async function updateJobModels({ id, company, position, createdBy }) {
    const conn = await getConn();
    // 1. Check if job exists
    const [jobRows] = await conn.execute("SELECT * FROM jobs WHERE id = ?", [id]);
    if (jobRows.length === 0) {
        return next(`No jobs found with this id ${id}`);
    }
    const job = jobRows[0];

    // 2. Authorization: check if user created this job
    if (job.createdBy !== createdBy) {
        return next("You are not authorized to update this job");
    }

    // 3. Update job
    const [result] = await conn.execute(
        "UPDATE jobs SET company = ?, position = ? WHERE id = ?",
        [company, position, id]
    );

    if (result.affectedRows === 0) {
        return next("Failed to update job");
    }

    // 4. Get updated job
    const [updatedRows] = await conn.execute("SELECT * FROM jobs WHERE id = ?", [id]);
    return updatedRows[0];

}

export async function deletejobModels({ id, createdBy }) {
    let conn = await getConn();
    // 1. Check if job exists
    const [jobRows] = await conn.execute("SELECT * FROM jobs WHERE id = ?", [id]);
    if (jobRows.length === 0) {
        return next(`No Job Found With This ID ${id}`);
    }
    const job = jobRows[0];

    // 2. Authorization: only creator can delete
    if (job.createdBy !== createdBy) {
        return next("You are not authorized to delete this job");
    }

    // 3. Delete job
    const [result] = await conn.execute("DELETE FROM jobs WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
        return next("Failed to delete job");
    }

    return result;

}


//Stats and Filter
export async function getJobStatsModel(userId) {
    const conn = await getConn();
    // 1. Get status counts
    const [statusRows] = await conn.execute(
        `SELECT status, COUNT(*) AS count 
     FROM jobs 
     WHERE createdBy = ? 
     GROUP BY status`,
        [userId]
    );

    const defaultStats = { pending: 0, reject: 0, interview: 0 };
    statusRows.forEach(row => {
        defaultStats[row.status] = row.count;
    });

    // 2. Get monthly stats
    const [monthlyRows] = await conn.execute(
        `SELECT YEAR(createdAt) AS year, MONTH(createdAt) AS month, COUNT(*) AS count
     FROM jobs
     WHERE createdBy = ?
     GROUP BY year, month
     ORDER BY year, month`,
        [userId]
    );

    const monthlyApplication = monthlyRows.map(row => {
        const date = moment().year(row.year).month(row.month - 1).format("MMM Y");
        return { date, count: row.count };
    });

    // 3. Total jobs
    const totalJob = statusRows.reduce((sum, row) => sum + row.count, 0);

    return { totalJob, defaultStats, monthlyApplication };
}
