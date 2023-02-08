function getSessionErrorData(req) {
    let sessionInputData = req.session.inputData;

    if (!sessionInputData) {
        sessionInputData = {
            hasError: false,
            title: '',
            content: '',
        };
    }

    req.session.inputData = null;
    return sessionInputData;
}

function getFlashErrorMessage(req, data, action) {
    req.session.inputData = {
        hasError: true,
        message: 'Invalid input - please check your data.',
        ...data
    };

    req.session.save(action);

}

module.exports = {
    getSessionErrorData, getFlashErrorMessage
}