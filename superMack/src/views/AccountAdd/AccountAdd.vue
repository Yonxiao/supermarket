<template>
    <div class="account-add">
        <!-- 面板控件 -->
        <el-card class="box-card">
            <!-- 头部 -->
            <div slot="header" class="clearfix">
                <span>添加管理员账号</span>
                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
            </div>
            <!-- 内容 -->
            <div class="text item">
                <el-form
                  style="width:300px;"
                  :model="accountAddForm"
                  status-icon :rules="rules"
                  ref="accountAddForm" 
                  label-width="100px" 
                  class="demo-ruleForm">
                    
                    <el-form-item label="账号" prop="account">
                        <el-input type="text" v-model="accountAddForm.account" autocomplete="off"></el-input>
                    </el-form-item>
                    
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="accountAddForm.password" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="确认密码" prop="checkPass">
                        <el-input type="password" v-model="accountAddForm.checkPass" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="选择用户组" prop="userGroup">
                        <el-select v-model="accountAddForm.userGroup" placeholder="请选择用户组">
                        <el-option label="超级管理员" value="超级管理员"></el-option>
                        <el-option label="普通管理员" value="普通管理员"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" round @click="submitForm()">添加</el-button>
                        <el-button type="danger" round @click="resetForm()">重置</el-button>
                    </el-form-item>

                </el-form>
            </div>
        </el-card>
    </div>
</template>
<script>
//引入正则函数
import { passwordReg } from '@/obj/validator';
import qs from 'qs';
// loading
import { Loading } from 'element-ui';

export default {
    data(){
        // 确认密码自定义验证函数
        const confirmPassword = (rule, value, callback) => { 
            if (value !== this.accountAddForm.password) {
                callback(new Error('两次的密码不一致')) //错误提示
                checkPassword();
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
            }
            else{
                if (this.accountAddForm.checkPass !== '') { // 如果确认密码不为空 触发一致性验证
                this.$refs.accountAddForm.validateField('checkPass')
            }
                callback()//成功
            }
        }   
        return{
            // 添加账号表单数据
            accountAddForm: {
                account: '',
                password: '',
                checkPass: '',
                userGroup: ''
            },
            //规则
            rules:{
                //账号
                account:[
                    {required: true, message: '请输入账号', trigger: 'blur'}, // 非空
                    {min: 3, max: 6, message: '账号长度 3~6 位', trigger: 'blur'}, // 长度
                ],
                //密码
                password:[
                    {required: true, validator: checkPassword, trigger: 'blur'} // 自定义
                ],
                checkPass:[
                    {required: true, validator: confirmPassword, trigger: 'blur'} // 自定义
                ],
                //用户组
                userGroup:[
                    {required:true,message:'请选择用户组',trigger:'change'}//非空
                ]
            }
        }
    },
    methods:{
         // 添加账号
        submitForm() {
            this.$refs.accountAddForm.validate(valid => {
                // 如果所有前端验证都通过 valid就是true 否则就是false
                if (valid) {
                    // 收集账号数据
                    let params = {
                        account: this.accountAddForm.account,
                        password: this.accountAddForm.password,
                        userGroup: this.accountAddForm.userGroup
                    }
                    //发送请求给后端
                    this.request.post('/account/accountadd',params)
                        .then(res => {
                            //接收后端返回的数据 res = {code:0, reason:'添加账号成功！'} ||{code:1, reason:'添加账号失败！'}
                            let {code, reason} =res;
                            //判断
                            if(code === 0){
                                //谈提示
                                this.$message({
                                    type:'success',
                                    message:reason
                                });
                                const loading = this.$loading({
                                    lock: true,
                                    text: '等我一下',
                                    spinner: 'el-icon-loading',
                                    background: 'rgba(0, 0, 0, 0.7)'
                                });
                                setTimeout(() => {
                                        loading.close();
                                }, 2000);
                                //跳页面
                                this.$router.push('/home/accountmanage')
                            }else if(code === 1){
                                //弹提示
                                this.$message.error(reason)
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })

                }else{
                    console.log('前端验证不通过，不允许提交！')
                    return
                }
            })
        },
        //重置
        resetForm(){
            //重置表单
            this.$refs.accountAddForm.resetFields()
        }
    }
}
</script>
<style lang='less'>
    @import './AccountAdd.less';
</style>