import * as jwt from "jsonwebtoken";

export interface IJwtService {
    secret: string;
    expiration: string;
    decodeToken(token: string): any | null;
    verifyToken(token: string): Object | null;
}
  
export class JWTService implements IJwtService {
    secret: string;
    expiration: string;
  
    constructor() {
      this.secret = '';
      this.expiration = process.env.JWT_EXPIRATION ?? '';
    }

    decodeToken(token: string): any {
      const base64 = token.replace(/-/g, '+').replace(/_/g, '/');
      // Decode the base64URL-encoded string
      const decodedResponse = Buffer.from(base64, 'base64').toString('utf-8');
      //return jwt.decode(token);
      return decodedResponse;
    }
    
    verifyToken(token: string) {
      return jwt.verify(token, this.secret);
    }

    generateToken(payload: object): string | null {
      if (!payload || Object.keys(payload).length === 0) {
        throw Error("Invalid payload to sign");
        return null;
      }
  
      return jwt.sign(payload, this.secret, { expiresIn: this.expiration });
    }
}