import jwt from "jsonwebtoken";
// import { accessSecret } from "../config";
const accessSecretString = "fysdiufydsuifdfughdfkjhgkjdfhgjdfkhgjkdfhgkdfj";
export default class JwtService {
  public accessTokenGenerator(userDetails: string): any {
    return new Promise((resolve, reject) => {
      const payload = {
        name: "Your trust.",
        iss: "task.com",
      };
      //   const secretKey = accessSecret;

      jwt.sign(
        payload,
        accessSecretString,
        {
          audience: userDetails,
        },
        (err, token) => {
          if (err) return reject(err);
          return resolve(token);
        }
      );
    });
  }
  public accessTokenVerify(token: any): any {
    // const secretKey = accessSecret;

    return jwt.verify(
      token,
      accessSecretString,
      (err: any, payload: any): any => {
        if (err)
          return {
            error: err,
          };
        return payload;
      }
    );
  }
}
