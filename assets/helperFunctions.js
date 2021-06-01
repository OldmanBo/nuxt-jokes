function axiosConfig(headerAccept, paramsPage, paramsLimit, paramsTerm) {
    return {
        headers: {
            "Accept": headerAccept
        },
        params: {
            page: paramsPage,
            limit: paramsLimit,
            term: paramsTerm
        }
    }
};


export default  axiosConfig 
