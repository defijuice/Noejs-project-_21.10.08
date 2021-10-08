const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");


// 게시글 작성 페이지
router.get("/",async(req, res) => {// 여기다가 이거 넣었다가 고생함
    try {

        res.render("write");
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : 페이지를 불러올 수 없습니다.`);
        res.render("err");
        return;
    }
});

module.exports = router;
