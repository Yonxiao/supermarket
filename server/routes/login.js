var express = require('express');
var router = express.Router();

// 引入数据库连接模块
const connection = require('./js/conn');
//引入jwt
const jwt = require('jsonwebtoken')

// 写一个路由 统一设置响应头 
router.all('*', (req, res, next) => {
	// 设置响应头解决跨域
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "authorization") // 允许通过头部信息authorization 携带token
	// 放行
	next();
})




//准备一个密匙
const secretKey = 'wummOOO';
//验证token的合法性
const expressJwt = require('express-jwt');
// 验证token合法性
router.use(expressJwt ({
    secret: secretKey
}).unless({
    path: ['/login/checklogin']  // 除了这个地址，其他的URL都需要验证（其他的所有请求 都要带上token 才能获取数据 否则不能获取到数据）
}));
// 路由拦截器
router.use(function (err, req, res, next) {
    // 如果前端没有token或者是错误的token 就会抛出如下错误
    if (err.name === 'UnauthorizedError') { 
        // 响应给前端token无效的信息
        res.status(401).send('token不合法...');
    }
})




//检查用户名和密码是否正确
router.post('/checklogin',(req,res) => {
    //接收参数
    let {account,password} = req.body;
    //写sql
    const sqlStr = `select * from account where account='${account}' and password='${password}'`
     console.log(sqlStr);
    //执行sql
    connection.query(sqlStr,(err,data) => {
        if (err) throw err;
        // console.log(data);
        //如果查询有数据  证明是不是有这个账号
        if(data.length){
            //测试
            console.log(data[0])
            //生成一个token给前端
            //secretKey密钥   expiresIn过期时间
            const token = jwt.sign(Object.assign({},data[0]), secretKey, { expiresIn:  60*60*2 }  );
            //密钥
            // console.log(token);

            res.send({code:0,reason:'欢迎登录！',token})
        }else{
            res.send({code:1,reason:'登录失败！请检查账号密码是否错误！'})
        }
    })
})

/* 获取当前登录用户名 */ 
router.get('/currentaccount', (req, res) => {
    // 响应当前登录的账号名给前端 （使用express-jwt验证token合法后 会把token的值 存入 req.user 其实就是当前登录账号数据对象）
    //req.user直接可以设置
	res.send(req.user.account)
})


module.exports = router;