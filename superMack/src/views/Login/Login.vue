<template>
    <div class="login">
        <div class="page-header-image"></div>
        <div class="login-wrap">
            <div class="title">
            </div>

            <!-- 登录表单 -->
            <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="100px" class="demo-ruleForm">
                
                <el-form-item label="账号" prop="account">
                    <el-input type="text" v-model="loginForm.account" autocomplete="off"></el-input>
                </el-form-item>
                
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="loginForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" round @click="submitForm()">登录</el-button>
                    <el-button type="danger" round @click="resetForm()">重置</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>
<script>
//引入验证密码函数
import { passwordReg } from '@/obj/validator';
// loading
import { Loading } from 'element-ui';
//引入local文件
import local from '@/obj/local'

export default {
    data(){
        // 确认密码自定义验证函数
        const confirmPassword = (rule, value, callback) => { 
            if (value !== this.loginForm.password) {
                callback(new Error('两次的密码不一致')) //错误提示
            }else if (value === '') {
                callback(new Error('确认密码不能为空')) // 输出错误提示信息
            }else if(!passwordReg(value)){
                //文本输入提示
                callback(new Error('以字母开头，长度在3~6之间，只能包含字符、数字和下划线'))//错误提示
            }
            else {           
                callback() //成功
            }
        }
        //密码的自定义验证
        const checkPassword = (rule, value , callback) =>{
            if(value === ''){
                //非空验证
                callback(new Error('密码不能为空'))//提示错误
            }
            else if(!passwordReg(value)){
                //文本输入提示
                callback(new Error('以字母开头，长度在3~6之间，只能包含字符、数字和下划线'))//错误提示
            } else{
                if (this.loginForm.checkPass !== '') { // 如果确认密码不为空 触发一致性验证
                    this.$refs.loginForm.validateField('checkPass')
            }
                callback()//成功
            }
        }
        return{
            //表单数据
            loginForm:{
                account:'',
                password:'',
                checkPass:''
            },
            //验证规则
            rules:{
                //账号
                account:[
                     {required:true,message:'请您输入账号',trigger:'blur'},//非空
                    {min:3,max:6,message:'账号长度3~6位',trigger:'blur'}//长度
                   
                ],
                //密码
                password:[
                    //自定义验证
                    {required:true,validator: checkPassword , trigger:'blur'}
                ],
                // 确认密码
                checkPass: [
                    {required: true, validator: confirmPassword, trigger: 'blur'} // 自定义验证
                ]
            }
        }
    },
    methods:{
        // 登录
        submitForm() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    let params = {
                        account: this.loginForm.account,
                        password: this.loginForm.password
                    }
                    //发送axios请求给后端
                    this.request.post('/login/checklogin',params)
                        .then(res => {
                            //接收参数
                            let {code,reason,token} = res;
                            if(code === 0 ){
                                //token传入蓝六七
                                local.save('wummOOO',token)
                                

                                //弹成功提示
                                this.$message({
                                    type:'success',
                                    message:reason
                                })
                                let options = this.$loading({
                                    lock: true,
                                    text: '正在努力加载中！！！',
                                    spinner: 'el-icon-loading',
                                    background: 'rgba(0, 0, 0, 0.7)'
                                });
                                // 加载
                                Loading.service(options);
                                //结束
                                setTimeout(() => {
                                    options.close();
                                }, 2000);
                                //跳转到后端首页
                                this.$router.push('/home')
                            }else if(code === 1){
                                //弹失败提示
                                this.$message.error(reason)
                            }
                        })
                        .catch(err => {
                            alert(1)
                            console.log(err);
                        })
                } else {
                    return
                }
            })
        },
        // 重置
        resetForm() {
            // 重置表单
            this.$refs.loginForm.resetFields()
        }
    }
}
</script>
<style lang="less">
    //引入样式
    @import './login.less';
</style>