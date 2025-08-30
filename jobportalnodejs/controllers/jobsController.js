import { createJob, deletejobModels, getAllJobsModels, getJobStatsModel, updateJobModels } from "../models/jobsModels.js";

export const createJobController = async (req, res, next) => {

    try {
        const { company, position, status, workType, workLocation } = req.body;
        if (!company || !position) {
            next("Please Provide All Fields")
        }
        const job = await createJob({
            company,
            position,
            status: status || "pending",
            workType: workType || "full-time",
            workLocation: workLocation || "Mumbai",
            createdBy: req.user.userId, // from auth middleware
        });
        res.status(201).json({ job });
    } catch (error) {
        console.log(error);

    }
}

//Get Job
// Controller
export const getAllJobsController = async (req, res, next) => {
    try {
        const { status, workType, search, sort } = req.query;
        const createdBy = req.user.userId;

        // pagination setup
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // get jobs with filters, sorting, pagination
        const { jobs, totalJobs } = await getAllJobsModels({
            status,
            workType,
            search,
            sort,
            createdBy,
            limit,
            offset,
        });

        const numOfPage = Math.ceil(totalJobs / limit);

        res.status(200).json({
            totalJobs,
            jobs,
            numOfPage,
        });
    } catch (err) {
        next(err);
    }
};

export const updateJobController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { company, position } = req.body;

        // Validation
        if (!company || !position) {
            return next("Please Provide All Fields");
        }

        // Call model and pass required values
        const updatedJob = await updateJobModels({
            id,
            company,
            position,
            createdBy: req.user.userId
        });

        if (!updatedJob) {
            return next("Job not found or not authorized");
        }

        res.status(200).json({ success: true, updatedJob });
    } catch (err) {
        next(err);
    }
};

//Delete Job
// ======= DELETE JOBS ===========
export const deleteJobController = async (req, res, next) => {
    const id = req.params.id;
    try {
        const result = await deletejobModels({
            id,
            createdBy: req.user.userId
        });

        res.status(200).json({ success: true, message: "Success, Job Deleted!" });
    } catch (err) {
        next(err);
    }
};

// ======= JOBS Stats Filter ===========
export const jobStatsController = async (req, res, next) => {
    try {
        const stats = await getJobStatsModel(req.user.userId);
        res.status(200).json(stats);
    } catch (err) {
        next(err);
    }
};