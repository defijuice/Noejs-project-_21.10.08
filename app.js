const express = require("express");
const mongoose = require("mongoose");
const renders = require('./renders');
const routers = require('./routers'); // 통신을 수행하는 Router 생성
const jwt = require("jsonwebtoken"); //6강
const User = require("./models/user"); //5강
const authMiddleware = require("./middlewares/auth-middleware");


const app = express();
const router = express.Router();
app.use("/public", express.static('public'));//이게 없으면api.js 연결이 안됨 

//회원가입API 5강
router.post("/users", async (req, res) => {
  const { /*email*/ nickname, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(400).send({
      errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
    });
    return;
  }
  // email or nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
  const existsUsers = await User.findOne({
    $or: [/*{ email }*/{ nickname }],
  });
  if (existsUsers) {
    // NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
    res.status(400).send({
      errorMessage: "닉네임이 이미 사용중입니다.",
    });
    return;
  }

  const user = new User({ /*email,*/ nickname, password });
  await user.save();

  res.status(201).send({});
});


//6강 로그인 API
router.post("/auth", async(req, res) => {
  const {nickname, password} = req.body;
  co

  const user =await User.findOne({nickname, password});

  if (!user){
    res.status(400).send({
      errorMessage: "닉네임 또는 패스워드가 잘못됐습니다."
    });
    return;
  }

  const token = jwt.sign({userId: user.userId}, "my-secret-key-1");
  res.send({
    token,
  });
});
//2주차 8강
router.get("/users/me", authMiddleware, async (req,res) => {
  const{user} = res.locals;
  res.send({
    user,
  });
});



// 최 상단에서 request로 수신되는 Post 데이터가 정상적으로 수신되도록 설정한다.
// 주소 형식으로 데이터를 보내는 방식
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static("public"));

// html을 대체하는 ejs 엔진을 설정
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// 몽고 DB 및 Schema 설정
// 몽고 DB의 스키마 설정시 index.js의 이름을 변경해선 안된다.
const connect = require("./schemas");
connect();


app.use("/api", express.urlencoded({ extended: false }), router);//register.html을 api.js과 연결시켜주는 역할
// app.use("/api", public);
app.use("/api", routers);
app.use(express.static("public"));
app.use("/", renders);

app.listen(8080, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});