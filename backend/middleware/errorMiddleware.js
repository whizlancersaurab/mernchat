const errorMiddleware = (err, req, res, next) => {
    res.status(500).json({
        message: "Something went wrong",
        success: false
    });
};

module.exports = errorMiddleware;
