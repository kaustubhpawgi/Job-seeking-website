

// this fn will accept another fn....... basically we are creating a wrapper function for async error
const catchAsyncError =(fn) =>{
    return (req,res,next) =>{
        Promise.resolve(fn(req,res,next)).catch(next);
    }
}
module.exports = catchAsyncError