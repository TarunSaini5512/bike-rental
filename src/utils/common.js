function sendResponse(res, data, message, success, code) {
    code = code || 200;

    const responseObj = {
        message: message || 'Something went wrong',
        success: success
    };

    if (data && Object.keys(data).length) {
        responseObj.data = data;
    }

    res.status(code).json(responseObj);
}

module.exports = { sendResponse };
