declare global {
    namespace Express {
      interface Request {
        user?: {
          // Define the properties of your user object here
          roleId?: number;
          // Add other user properties if needed
        };
      }
    }
  }