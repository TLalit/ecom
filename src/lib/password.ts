import bcrypt from "bcrypt";

export const saltAndHashPassword = (password: string) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  return hashedPassword;
};
export const comparePassword = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
};
