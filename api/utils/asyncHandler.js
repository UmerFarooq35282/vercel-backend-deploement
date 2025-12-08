const { SuccessResponse, ErrorResponse } = require("./sendingResponse.js");

module.exports = function asyncHandler(fn) {
    return async function (req, res, next) {
        try {
            await fn(req, res, next);
        } catch (err) {
            if (err instanceof SuccessResponse || err instanceof ErrorResponse) {
                return err.send(res);
            }
            next(err);
        }
    };
};
