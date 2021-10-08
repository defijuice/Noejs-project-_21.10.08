const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req, res, next) => {
  console.log("여기 미들웨어를 지났쳤어요!!")
  const { authorization } = req.headers; //헤더에서 auth~가 있음
  const [authType, authToken] = (authorization || "").split(" "); //공백을 기준으로 type과 token을 분리

  if (!authToken || authType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다!!",
    });
    return;
  }

  try {
    const { userId } = jwt.verify(authToken, "my-secret-key-1");
    User.findById(userId).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (err) {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다......?",
    });
  }
};