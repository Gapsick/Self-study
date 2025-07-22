// errorHandler.js

function errorHandler (err, req, res, next) {
    console.error("Error: ", err.message);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Server error",
        data: null,
        code: err.status || 500
    })
}

module.exports = errorHandler