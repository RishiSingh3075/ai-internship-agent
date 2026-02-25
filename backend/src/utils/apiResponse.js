const apiResponse=(statusCode,data,message)=>{
    return{
        success:statusCode<400,
        message,
        data
    };
};
export default apiResponse;