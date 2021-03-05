module.exports = (req, res, next) => {
    // SET THE HEADER BEFORE ACCESS MAIN ROUTE
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // GO TO THE NEXT MIDDLEWARE
    next();
}