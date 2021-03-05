module.exports = (error, req, res, next) => {
    // LOG THE ERROR
    console.log(error);

    // GET THE ERROR DATA
    const status = error.statusCode;
    const message = error.message;
    const data = error.data;

    // RETURN JSON RESPONSE
    res.status(status).json({
        message: message,
        data: data
    });
}