<template>
    <div class="top">
        <el-row :gutter="20">
            <!-- 左侧标题 -->
            <el-col :span="20">
                <h3 class="title">
                    <i class="el-icon-menu"></i>
                    安德玛管理系统
                </h3>
            </el-col>
            <el-col :span="4">
                <el-row :gutter="20">

                    <!-- 头像 -->
                    <el-col :span="6">
                        <div class="avatar">
                            <img width="100%" height="100%" :src="imgUrl" alt="">
                        </div>
                    </el-col>

                    <el-col :span="18" class="right-right">
                        <el-dropdown @command="handleCommand">
                            <span class="el-dropdown-link">
                                {{ account }}<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="personal">个人中心</el-dropdown-item>
                                <el-dropdown-item command="logout">登出</el-dropdown-item>                               
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
//引入local
import local from '@/obj/local'
export default {
    data () {
        return {
            account: '',
            imgUrl:''
        }
    },
    methods:{
        //点击下拉的函数
        handleCommand(command){
            if (command === 'personal') {
                // 跳转到个人中心
                this.$router.push('/home/personal')
            }else if(command === 'logout'){
                // 清除token
                local.remove('wummOOO');
                //弹出提示框
                this.$confirm('此操作将登出该账号, 是否继续?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    //加载
                    const loading = this.$loading({
                        lock: true,
                        text: '正在登出...',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    setTimeout(() => {
                        loading.close();
                    }, 2000);
                    
                    //清除token
                    local.remove('wummOOO');
                    //跳转到登录页面
                    this.$router.push('/login')
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消登出'
                    });          
                });
            }
        },
        //获取到当前登录的账号
        getUserInfo(){
            this.request.get('/account/accountinfo')
                .then(res => {
                    //接收后端响应的数据
                    let {account, img_url} = res[0];
                    // 赋值给对应的变量
                    this.account = account;
                    this.imgUrl = `http://127.0.0.1:666/${img_url}`;
                })
                .catch(err => {
                    console.log(err)
                })
        }
    },
    created(){
        //调用函数 获取到当前登录的账号
        this.getUserInfo();
    }
}
</script>

<style lang="less">
//引入样式
@import './Top.less';
</style>