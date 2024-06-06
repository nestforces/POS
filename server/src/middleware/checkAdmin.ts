// // middleware/isAdmin.ts
// import { Request, Response, NextFunction } from 'express';

// const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
//   // Assuming you have a way to identify the user's role (e.g., stored in req.user.role)
//   const userRole = req.user?.roleId; // Adjust this based on your authentication logic

//   if (userRole === 2) {
//     // User is an admin, proceed to the next middleware or route handler
//     next();
//   } else {
//     // User is not an admin, return a forbidden response
//     return res.status(403).json({ error: 'Access forbidden. Admin privileges required.' });
//   }
// };

// export {
//     checkAdmin
// }