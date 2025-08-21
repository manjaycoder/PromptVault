import expressAsyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'

export const ProtectRoutes=expressAsyncHandler(async(req,res,next)=>{
  const token = req.cookies?.token; 

  if (!token) {
    return res.status(401).json({ error: "Access denied, no token provided" });
  }

 
  try {
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
        
         req.user = { id: decoded.id };
     next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
})
export default ProtectRoutes
