class ProductFilter {
    constructor(query, queryStr) {
        this.query = query,
            this.queryStr = queryStr
    }

    search() {
        const keyword = this.queryStr.keywords ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        } : {}

        this.query = this.query.find({ ...keyword });
        return this;
    };

    filter() {
        //TODO ---> start <---
        //! when the request queries (*from postman*) don´t match queries in mongoose
        const queryCopy = { ...this.queryStr }

        // TODO 2  START ---> sort, limit, page, fields actions <---
        const deletedArea = ["keyword", "page", "limit"]
        deletedArea.forEach(item => delete queryCopy[item]);

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,
            (key) => `$${key}`)

        this.query = this.query.find(JSON.parsequeryStr);
        return this;
    };
    pagination(resultPerPage) {
        const activePage = rhis.queryStr.page * 1 || 1
        const skip = resultPerPage * (activePage - 1)

        this.query = this.query.limit(resultPerPage).skip(skip)
    };
}

module.exports = ProductFilter