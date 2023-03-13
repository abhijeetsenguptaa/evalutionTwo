


const authorize = (permitted) => {
    return (req,res,next) => {
        if(permitted.includes(role)){
            next();
        }else{
            res.status(404).json({'msg':'You are not permitted!'})
        }
    }
}


module.exports = {authorize};