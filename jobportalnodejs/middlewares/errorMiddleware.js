//error middleware || Next Function

const errorMiddleware = (err, req, res, next) => {
    console.log(err);

    const defaultErrors = {
        statusCode: 500,
        message: err
    }


    // Missing Field Error
    if (err.name === 'ValidationError') {
        defaultErrors.statusCode = 400;
        defaultErrors.message = Object.values(err.errors)
            .map((item) => item.message)
            .join(",");
    }

    //Duplicate Error 
    if (err.code && err.code === 'ER_DUP_ENTRY') {
        defaultErrors.statusCode = 400;
        const fieldMatch = err.sqlMessage.match(/for key '(.+)'/);
        const field = fieldMatch ? fieldMatch[1] : 'Field';
        defaultErrors.message = `${field} must be unique`;


    }

    res.status(defaultErrors.statusCode).json({ message: defaultErrors.message });
};

export default errorMiddleware