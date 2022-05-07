if (!process.env.JWT_SECRET) {
  throw Error("No jwt secret");
}
export const JWTConfig = {
  secret: process.env.JWT_SECRET,
};
