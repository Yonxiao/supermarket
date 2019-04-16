var express = require('express');
var router = express.Router();

// 引入数据库连接模块
const connection = require('./js/conn');

// 写一个路由 统一设置响应头 
router.all('*', (req, res, next) => {
	// 设置响应头解决跨域
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "authorization"); // 允许通过头部信息authorization 携带token
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



// 添加账号路由 
router.post('/accountadd', (req, res) => {

	// 接收数据
	let {account, password, userGroup} = req.body;

	let imgUrl = '/upload/23.jpg'; // 默认头像	

	// // 写sql
	const sqlStr = `insert into account(account,password,user_group,img_url) values('${account}','${password}','${userGroup}','${imgUrl}')`;
	
	// console.log(sqlStr)
	// // 执行sql
	connection.query(sqlStr,(err,data) => {
		if (err) throw err;
		if(data.affectedRows > 0){
			//成功  响应成功的数据
			res.send({code:0, reason:'添加账号成功！'})
		}else{
			//响应失败的数据给前端
			res.send({code:1, reason:'添加账号失败！'})			
		}
	})
})

// 请求账号列表路由
router.get('/accountlist', (req, res) => {
	// 写sql
	const sqlStr = `select * from account order by create_date desc`;//所有的数据按时间的降序
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		res.send(data);
	})
})

// 删除
router.get('/delete',(req,res) => {
	//接收id
	let { id } = req.query;
	//构造sql
	const sqlStr = `delete from account where id=${id}`;
	// console.log(sqlStr);
	//执行
	connection.query(sqlStr,(err, data) =>{
		if (err) throw err;
		// console.log(data);
		if(data.affectedRows > 0){
			res.send({code : 0, reason: '删除成功！'})
		}else{
			res.send({code : 1, reason: '删除失败！'})
		}
	})
})

//修改数据回填
router.get('/editaccount',(req , res) => {
	// 接收id
	let { id } = req.query;
	// 构造sql
	const sqlStr = `select * from account where id=${id}`;
	//执行sql
	connection.query(sqlStr,(err ,data) => {
		if (err) throw err;
		res.send(data);//查询到的数据响应给前端
	})
})

//保存数据
router.post('/saveeditaccount',(req , res) => {
	//接收参数
	let {account , userGroup , editId} = req.body;

	//构造sql
	const sqlStr = `update account set account='${account}', user_group='${userGroup}' where id=${editId}`

	// console.log(sqlStr);
	//执行sql
	connection.query(sqlStr,(err,data) => {
		if (err) throw err;
		//给前端返回信息
		if(data.affectedRows > 0){
			res.send({code:0,reason:'修改数据成功！'})
		}else{
			res.send({code:1,reason:'修改数据失败！'})			
		}
	})
})

/* 分页路由 */ 
router.get('/accountlistbypage', (req, res) => {
	// 接收参数
	let {currentPage, pageSize} = req.query;

	// 构造sql
	let sqlStr = `select * from account order by create_date desc`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		// 计算数据总条数
		let total = data.length;

		// 计算跳过多少条
		let n = (currentPage - 1) * pageSize;
		// 拼接分页sql
		sqlStr += ` limit ${n}, ${pageSize}`;

		// 执行sql
		connection.query(sqlStr, (err, data) => {
			if (err) throw err;
			// 把数据总条数和每个页码对应的数据发送给前端
			res.send({total, data})
		})
	})
})

/* 批量删除 */
router.get('/batchdel', (req, res) => {
	// 接收id
	let { idArr } = req.query;

	// 构造sql
	const sqlStr = `delete from account where id in (${idArr})`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		if (data.affectedRows > 0) {
			res.send({code: 0, reason: '批量删除成功!'})
		} else {
			res.send({code: 1, reason: '批量删除失败!'})
		}
	})
})


/* 检查旧密码 */ 
router.post('/passwordmodify', (req, res) => {
	// 接收前端传过来的用户输入的旧密码
	let { oldPassword } = req.body;
	// 获取当前登录的用户密码
	let { password } = req.user;
    // 判断
    if (password === oldPassword) {
    	res.send({code: 0, reason: '原密码输入正确'})
    } else {
		res.send({code: 1, reason: '原密码输入错误'})
    }
})

/* 修改密码 */ 
router.post('/savenewpassword', (req, res) => {
	// 接收新密码
	let { newPassword } = req.body;
	// 获取当前登录用户的id
	let { id } = req.user;

	// 构造sql
	const sqlStr = `update account set password='${newPassword}' where id=${id}`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		if (data.affectedRows > 0) {
			res.send({code: 0, reason: '密码修改成功，请重新登录！'})
		} else {
			res.send({code: 1, reason: '密码修改失败！'})
		}
	})
})

/* 个人信息 */ 
router.get('/accountinfo', (req, res) => {
	// 获取当前登录用户的id
	const id = req.user.id;
	console.log(id)
	const sqlStr = `select * from account where id=${id}`;
	console.log(sqlStr)
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		res.send(data)
	})
})


/* ----------------- 上传后端配置 开始 -------------- */ 

// 引入multer
const multer = require('multer')

// 配置上传到服务器放置的目录 和 重命名
const storage = multer.diskStorage({
	destination: 'public/upload', // 图片上传到服务器的这个目录
	  // 图片重命名
    filename (req, file, cb) {
        var fileFormat =(file.originalname).split("."); 
        // 获取时间戳
        var filename = new Date().getTime();  
        // 124354654 + "." + jpg
        cb(null, filename + "." + fileFormat[fileFormat.length - 1]);
    }
})

// 上传对象
const upload = multer({
    storage,
});

/* ----------------- 上传后端配置 结束-------------- */ 

//上传头像请求
router.post('/uploadavatar',upload.single('file'),(req,res) => {
	//获取到文件名
	let filename = req.file.filename;

	//拼装路径
	let path = `/upload/${filename}`;

	//构造sql
	const sqlStr = `update account set img_url='${path}' where id=${req.user.id}`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		if (data.affectedRows > 0) {
			res.send({code: 0, reason: "头像修改成功!", path})
		} else {
			res.send({code: 1, reason: "头像修改失败"})
		}
	})
})

/* 用户角色 */ 
router.get('/menus', (req, res) => {
	// 获取用户组
	let userGroup = req.user.user_group;

	let role = userGroup === '超级管理员' ? 'super' : 'normal';

	let menus =  [
                // 系统管理
                {
                    iconClass: 'el-icon-document',
                    title: '系统管理',
                    roles: ['super', 'normal'],
                    children: [     // 子菜单
                        {path: '/home/systeminfo', subTitle: '系统信息'}
                    ]
                },
                // 账号管理
                {
                    iconClass: 'el-icon-news',
                    title: '账号管理',
                     roles: ['super', 'normal'],
                    children: [
                         {path: '/home/accountmanage', subTitle: '账号管理'},
                         {path: '/home/accountadd', subTitle: '添加账号'},
                         {path: '/home/passwordmodify', subTitle: '密码修改'}
                    ]
                },
                // 商品管理
                {
                    iconClass: 'el-icon-goods',
                    title: '商品管理',
                     roles: ['super', 'normal'],
                    children: [
                        {path: '/home/goodsmanage', subTitle: '商品管理'},
                        {path: '/home/goodsadd', subTitle: '添加商品'},
                    ]
                },
                // 统计管理
                {
                    iconClass: 'el-icon-edit-outline',
                    title: '统计管理',
                     roles: ['super'],
                    children: [
                        {path: '/home/salestotal', subTitle: '销售统计'},
                        {path: '/home/stocktotal', subTitle: '进货统计'},
                    ]
                }
            ]

    // 功能和上面一样 把菜单数组中 包含当前登录用户角色的数据 过滤出来
    let accessMenu = menus.filter(item => item.roles.includes(role))

	res.send({accessMenu})
})



module.exports = router;
