const mongoose = require('mongoose');
const global = require('../global');

exports.getDatas = async (modelName, initialFilter, req) => {

    // PREPARE QUERY
    const queryParam = req.query;

    // FILTER
    let filter = initialFilter;
    if(queryParam.filter){
        filter = {...filter, ...JSON.parse(queryParam.filter)};
    }
    let query = mongoose.model(modelName).find(filter);

    // SORTING
    if(queryParam.sortBy){
        const sortBy = JSON.parse(queryParam.sortBy);
        query = query.sort(sortBy);
    }

    // PAGINATION
    const page = parseInt(queryParam.page) || global.DEFAULT_PAGINATION_PAGE;
    const perPage = parseInt(queryParam.perPage) || global.DEFAULT_PAGINATION_PER_PAGE;
    query = query.skip((page - 1) * perPage).limit(perPage)

    // GET THE DATA
    const data = await query;

    // GET THE TOTAL DATA
    const totalData = await mongoose.model(modelName).find(filter).countDocuments();

    // RETURN THE DATA
    return {
        data: data,
        total: totalData,
        page: page,
        perPage: perPage
    }
}