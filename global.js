module.exports = {
    SUCCESS_GENERAL: {
        MESSAGE: "Success",
        CODE: 200
    },
    SUCCESS_POST: {
        MESSAGE: "Data added successfully",
        CODE: 201
    },
    ERROR_UNAUTHENTICATED: {
        MESSAGE: "Invalid Authentication",
        CODE: 401
    },
    ERROR_UNAUTHORIZED: {
        MESSAGE: "Forbidden",
        CODE: 403
    },
    ERROR_NOT_FOUND: {
        MESSAGE: "Not Found",
        CODE: 404
    },
    ERROR_VALIDATION: {
        MESSAGE: "Validation Error",
        CODE: 422
    },
    ERROR_SERVER_GENERAL: {
        MESSAGE: "Internal Server Error",
        CODE: 500
    },
    ACTION_RESET_PASSWORD: 1001,
    ACTION_NEW_PRO: 2001,
    ACTION_UPVOTE_PRO: 2002,
    ACTION_NEW_CON: 2011,
    ACTION_UPVOTE_CON: 2012,
    ACTION_UPVOTE_FORUM: 3001,
    ACTION_UPVOTE_COMMENT: 3011,
    EMAIL_FORGOT_PASSWORD: link => {
        return "<p>Here is your link to create new password</p>" +
            "<p>" + link + "</p>" +
        "<p><a href='" + link + "'>Create Password</a></p>"
    },
    EMAIL_NEW_ADMIN_PASSWORD: password => {
        return "<p>Here is your default password to access your admin account</p>" +
            "<p><b>" + password + "</b></p>" +
            "<p>Please consider to change it immediately after sign in</p>"
    },
    DEFAULT_PAGINATION_PAGE: 1,
    DEFAULT_PAGINATION_PER_PAGE: 20
}