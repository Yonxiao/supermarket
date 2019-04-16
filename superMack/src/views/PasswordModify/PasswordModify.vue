<template>
    <div class="password-modify">
         <!-- 面板组件 -->
       <el-card class="box-card">
            <!-- 头部 -->
            <div slot="header" class="clearfix">
                <span>密码修改</span>
            </div>
            <!-- 内容 -->
            <div class="text item">
                <el-form 
                    style="width: 300px;"
                    size="small" 
                    :model="passwordMidifyForm"
                    status-icon
                    :rules="rules"
                    ref="passwordMidifyForm"
                    label-width="100px"
                    class="demo-ruleForm"
                    >
                    <!-- 旧的密码 -->
                    <el-form-item label="旧的密码" prop="oldPassword">
                        <el-input type="text" v-model="passwordMidifyForm.oldPassword" autocomplete="off"></el-input>
                    </el-form-item>

                    <!-- 新的密码 -->
                    <el-form-item label="新的密码" prop="newPassword">
                        <el-input type="text" v-model="passwordMidifyForm.newPassword" autocomplete="off"></el-input>
                    </el-form-item>

                    <!-- 确认新密码 -->
                    <el-form-item label="确认新密码" prop="checkNewPassword">
                        <el-input type="text" v-model="passwordMidifyForm.checkNewPassword" autocomplete="off"></el-input>
                    </el-form-item>
                 
                    <!-- 按钮 -->
                    <el-form-item>
                        <el-button type="primary" @click="submitForm()">确认修改</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>
<script>
import { passwordReg } from '@/obj/validator'
import local from '@/obj/local'
export default {
    data () {
        // 自定义验证旧密码
        const validatorOldPassword = (rule, value, callback) => {
            // 发送axios给后端
            this.request.post('/account/passwordmodify', { oldPassword: value })
                .then(res => {
                    // 接收后端响应的数据
                    let {code, reason} = res;
                    // 判断
                    if (code === 0) {
                        callback() // 成功
                    } else {
                        callback(new Error(reason)) // 失败
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }

        // 验证新密码
        const validatorNewPassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('必须输入新密码'))
            } else if (!passwordReg(value)) {
                callback(new Error('字母开头，3~6位，只能有字符、数字、下划线'))
            } else {
                if (this.passwordMidifyForm.checkNewPassword !== '') {
                    this.$refs.passwordMidifyForm.validateField('checkNewPassword')
                }
                callback()
            }
        }

        // 验证确认新密码
        const validatorCheckNewPassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入确认新密码'))
            } else if (value !== this.passwordMidifyForm.newPassword) {
                callback(new Error('两次密码不一致'))
            } else {
                callback()
            }
        }

        return {
            // 修改密码表单
            passwordMidifyForm: {
                oldPassword: '',
                newPassword: '',
                checkNewPassword: ''
            },
            // 验证
            rules: {
                oldPassword: [
                    {required:true, validator: validatorOldPassword, trigger: 'blur'}
                ],
                newPassword: [
                    {required: true, validator: validatorNewPassword, trigger: 'blur'}
                ],
                checkNewPassword: [
                    {required: true, validator: validatorCheckNewPassword, trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        // 确认修改
        submitForm() {
            // 验证
            this.$refs.passwordMidifyForm.validate(valid => {
                if (valid) {
                    // 收集新密码
                    let params = {
                        newPassword: this.passwordMidifyForm.newPassword
                    }
                    // 发送请求给后端
                    this.request.post('/account/savenewpassword', params)
                        .then(res => {
                            // 接收数据
                            let {code, reason} = res;
                            // 判断
                            if (code === 0) {
                                // 弹成功提示 
                                this.$message({
                                    type: 'success',
                                    message: reason
                                })   
                                
                                // 删除token
                                local.remove('wummOOO')

                                // 跳转到登录页面
                                this.$router.push('/login')
                                
                            } else if (code === 1) {
                                this.$message.error(reason)
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                } else {
                    return
                }
            })
        }
    }
}
</script>
<style lang="less">
    @import "./PasswordModify.less";
</style>

