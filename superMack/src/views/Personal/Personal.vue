<template>
    <div class="personal">
     <!-- 面板组件 -->
       <el-card class="box-card">
            <!-- 头部 -->
            <div slot="header" class="clearfix">
                <span>个人中心</span>
            </div>
            <!-- 内容 -->
            <div class="text item">
                <!-- 头像 -->
                <div>
                    <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :http-request="upLoad"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
               <!-- 用户信息 -->
                <div style="margin-top: 20px;">
                    <p>ID: {{ accountInfo.id }}</p>
                    <p>账号：{{ accountInfo.account }} </p>
                    <p>用户组： {{ accountInfo.user_group }}</p>
                    <p>创建时间： {{ accountInfo.create_date | filterDate }}</p>
                </div>

            </div>
        </el-card>
    </div>
</template>
<script>
// 引入模块
import moment from 'moment'
import axios from 'axios'

export default {
    data () {
        return {
            accountInfo: "",
            imageUrl: ''
        }
    },
    methods: {
        // 获取信息函数
        getAccountInfo() {
            this.request.get('/account/accountinfo')
             .then(res => {
                 this.accountInfo = res[0]
             })
             .catch(err => {
                 console.log(err)
             })
        },
        // 头像上传之前回调
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        // 自定义上传函数
        upLoad(file) {

           // 创建一个formData对象
           let formData = new FormData();
           //  把文件数据 放入 formData
           formData.append('file', file.file)   

           // 发送axios给后端 把文件新传递给后端
           axios.post('/account/uploadavatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
           })
           .then(response => {
              // 接收后端响应的数据
              let {code, reason, path} = response.data;   
              // 判断   
              if (code === 0) {
                  this.$message({
                      type: 'success',
                      message: reason
                  })
                 // 回填头像
                 this.imageUrl = `http://127.0.0.1:666${path}`; 

                //  触发父组件方法
                this.$emit('A')
                
              } else if (code === 1) {
                  this.$message.error(reason)
              }
              
           })
           .catch(err => {
               console.log(err)
           })
        }
    },
    created() {
        this.getAccountInfo(); // 调用函数 获取信息
    },
    filters: {
        filterDate(val) {
            return moment(val).format('YYYY/MM/DD hh:mm:ss')
        }
    }
}
</script>
<style lang="less">
.personal {
    // 面板组件
    .el-card {
        // 面板头
        .el-card__header {
            font-size: 20px;
            font-weight: bold;
            background-color: #f1f1f1;
        }
        // 面板身体
        .el-card__body {
            .avatar-uploader .el-upload {
                border: 1px dashed #d9d9d9;
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }
            .avatar-uploader .el-upload:hover {
                border-color: #409EFF;
            }
            .avatar-uploader-icon {
                font-size: 28px;
                color: #8c939d;
                width: 178px;
                height: 178px;
                line-height: 178px;
                text-align: center;
            }
            .avatar {
                width: 178px;
                height: 178px;
                display: block;
            }
        }
    }
}
</style>


