import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';

dotenv.config();

interface User {
  id: string;
  isAdmin: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

class TokenValidation {
  public anyUserVerification(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "Token não fornecido." });
    }

    const tokenWithoutBearer = token.substring("Bearer ".length);
    jwt.verify(tokenWithoutBearer, process.env.SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        console.log(process.env.SECRET);
        return res.status(401).json({ error: "Token inválido." });
      }

      req.user = decoded as User;
      
      next();
    });
  };

  public adminUserVerification(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    
    if (!token) {
      return res.status(401).json({ error: "Token não fornecido." });
    }
    
    const tokenWithoutBearer = token.substring("Bearer ".length);
    jwt.verify(tokenWithoutBearer, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Token inválido." });
      }

      const user = decoded as User;
      if (!user.isAdmin) {
        return res.status(401).json({ error: "Requisição requer permissão de administrador."});
      }

      req.user = user;

      next();
    });
  };
}

export default new TokenValidation();
