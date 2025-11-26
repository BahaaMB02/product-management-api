
const authenticateAdmin=(req, res, next) => {
const role=req.header('X-User-Role');
if(role==='admin')
{
    req.userRole=role;
    next();
        
}
else if(role ==='user')
{
    return res.status(403)
    .json({
        success:false,
        message:'You do not have permission to perform this action.',
        error:{
            code:'FORBIDDEN',
            details:'Admin role required for this operation.'
        }
    }); 
}
else 
{
    return res.status(401)
    .json({
        success:false,
        message:'Authentication required.',
        error:{
            code:'UNAUTHORIZED',
            details:'X-User-Role header is missing or invalid.'
        }
    }); 
}

}

const authenticateUser=(req, res, next) => {
    const role=req.header('X-User-Role');
    if(role==='admin' || role==='user')
    {
        req.userRole=role;
        next();
        
    }
    else
    {
        return res.status(401)
        .json({
            success:false,
            message:'Authentication required.',
            error:{
                code:'UNAUTHORIZED',
                details:'X-User-Role header is missing or invalid.'
            }
        }); 
    }
}

module.exports={authenticateAdmin, authenticateUser};