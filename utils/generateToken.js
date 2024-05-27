import jwt from "jsonwebtoken";

function generateToken(user) {
  return jwt.sign(
    {
      id: user?._id,
    },
    process.env.JWT_KEY || "@njkddm#jkim"
  );
}

export default generateToken;
