function catchError(error) {
    return error.stack;
}

function handleError(callback, title, message) {
    callback({
        'title': title,
        'passed': false,
        'message': message
    });
}

module.exports.catchError = catchError;
