import { hashPassword, comparePassword } from '../lib/hash.mjs'
import { signUpUser } from '../db/crud.mjs';
import { UserResponseSchema } from './schemas.mjs';


const createUser = async (req, res) => {
    // logger.info('Creating new user!!')
      try {
        const hashedPassword = hashPassword(req.body.password);
        req.body.password = hashedPassword;
    
        const newUser = await signUpUser(req); 
        // await sendVerificationEmail(req.body.email, newUser.id);
          // Validate and filter response
      const responseUser = UserResponseSchema.parse(newUser);
    
   // Dynamic generation of HATEOAS links
   const userId = newUser.id;
  
   const links = [
     { rel: "self", href: `http://localhost:8000/api/users/${userId}` },
     { rel: "login", href: `http://localhost:8000/api/users/login` },
     { rel: "update", href: `http://localhost:8000/api/users/${userId}/update` },
     { rel: "delete", href: `http://localhost:8000/api/users/${userId}/delete` }
   ];
  
   res.status(201).json({
     message: "User created successfully",
     user: responseUser,
     links: links // Include dynamic links
   });
  } catch (error) {
   res.status(500).json({ message: error.message });
  }
    };
  

export { createUser };