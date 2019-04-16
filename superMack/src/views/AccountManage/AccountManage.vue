<template>
    <div class="account-manage">
        <el-card class="box-card">
            <!-- 头部 -->
            <div slot="header" class="clearfix">
            <span>账号管理</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
            </div>
            <!-- 内容 -->
            <div class="text item">
                <el-table
                  ref="accountTableData"
                  @selection-change="handleSelectionChange" 
                  :data="accountTableData" 
                  tooltip-effect="dark" 
                  style="width: 100%">
                    
                        <el-table-column
                        type="selection"
                        width="55">
                        </el-table-column>

                        <el-table-column
                        prop="account"
                        label="账号">
                        </el-table-column>

                        <el-table-column
                        prop="user_group"
                        label="用户组">
                        </el-table-column>

                        <el-table-column
                        label="日期">
                        <template slot-scope="scope">{{ scope.row.create_date | filterDate }}</template>
                        </el-table-column>

                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                plain
                                size="mini"
                                @click="handleEdit(scope.row.id)"><i class="el-icon-edit"></i>修改</el-button>
                                <el-button
                                plain
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.row.id)"><i class="el-icon-delete"></i>删除</el-button>
                            </template>
                        </el-table-column>
                </el-table>


                <!-- 修改模块 -->
                <el-dialog width="500px" title="修改账号" :visible.sync="dialogFormVisible">
                    <el-form :model="editForm" :rules="rules" ref="editForm">

                        <!-- 账号 -->
                        <el-form-item prop="account" style="width:300px" label="账号" :label-width="formLabelWidth">
                        <el-input v-model="editForm.account" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item prop="userGroup" style="width:300px" label="用户组" :label-width="formLabelWidth">
                        <el-select v-model="editForm.userGroup" placeholder="请选择用户组">
                            <el-option label="超级管理员" value="超级管理员"></el-option>
                            <el-option label="普通用户" value="普通用户"></el-option>
                        </el-select>
                        </el-form-item>

                    </el-form>

                    <div slot="footer" class="dialog-footer">
                        <el-button @click="falseEdit">取 消</el-button>
                        <el-button type="primary" @click="saveEdit">确 定</el-button>
                    </div>

                </el-dialog>

                <!-- 分页组件 -->
                <div style="margin-top: 20px">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[1, 3, 5, 10, 20, 50]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>`
                </div>

                <!-- 批量删除&取消选择 -->
                <div style="margin-top: 20px">
                    <el-button type="danger" @click="batchDel">批量删除</el-button>
                    <el-button type="success" @click="cancelSelect">取消选择</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>
<script>
// 引入moment
import moment from 'moment';

export default {
  data() {
    return {
        // 账号表格数据   
        accountTableData: [],
        currentPage: 1,  // 当前页
        pageSize: 5,
        total: 0, // 数据总条数
        editForm: { // 修改模态框的数据对象
            account: '',
            userGroup: ''
        },
        editId: '',//要修改的数据id
        dialogFormVisible: false,  // 模态框的显示和隐藏状态
        formLabelWidth: '100px', // 修改表单标签的宽度
        rules:{
            //表单验证规则
            account:[
                {required:true,message:'账号不能为空！',trigger:'blur'},//非空判定
                {min:3,max:6,message:'账号的长度3~6位！',trigger:'blur'}//长度判定
            ]
        },
        selectedId: [] // 批量删除选中id数组
    };
  },
  methods: {
    //请求账号数据
    getAccount(){
        //发送请求  获取到所有的账号数据
        this.request.get('/account/accountlist')
            .then(res => {
                this.accountTableData = res;
            })
            .catch(err => {
                console.log(err)
            })
    },
        // 按照分页请求数据
    getAccountListByPage() {
      // 收集参数
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      // 请求数据
      this.request.get('/account/accountlistbypage', params)
        .then(res => {
          // 接收后端返回的数据
          let {total,  data} = res;
          // 赋值给对应变量
          this.total = total;
          this.accountTableData = data;
          
          // 如果这一页已经没有数据了
          if (!data.length && this.currentPage !== 1) {
            // 回到上一页
            this.currentPage -= 1;
            // 调用自己
            this.getAccountListByPage();
          }
        })
        .catch(err => {
          console.log(err)
        })

    },
    // 删除
    handleDelete(id) {
        //删除弹出提示框
        this.$confirm('此操作将永久删除该账号, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.request.get('/account/delete',{ id })
            .then(res => {
                //接收后端的数据
                let {code,reason} = res;
                //判断
                if(code === 0){
                    //提示
                    this.$notify({
                        title: reason,
                        message: '刚刚您删除了一条用户信息！',
                    });
                    const loading = this.$loading({
                        lock: true,
                        text: '正在删除...',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    setTimeout(() => {
                            loading.close();
                    }, 2000);
                    //刷新页面
                    this.getAccountListByPage();
                }else if(code === 1){
                    //提示
                    this.$message.error(reason)
                }
            })
            .catch(err => {
                console.log(err)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 数据回填
    handleEdit(id) {
        //显示修改框
        this.dialogFormVisible = true;

        //把修改的数据保存起来
        this.editId = id;

        //发送请求  把id发送给后端
        this.request.get('/account/editaccount',{ id })
            .then(res => {
                //数据回填
                this.editForm.account = res[0].account;
                this.editForm.userGroup = res[0].user_group;
            })
            .catch(err => {
                console.log(err);
            })
        console.log(id);
    },
    //保存修改数据
    saveEdit(){
        this.$refs.editForm.validate(valid => {
            if(valid){
                //前端验证通过
                //关闭模块
                this.dialogFormVisible = false;

                //收集参数
                let params = {
                    account: this.editForm.account,
                    userGroup: this.editForm.userGroup,
                    editId: this.editId
                }
                //发送请求把新数据 和原来的id一起发送给后端
                this.request.post('/account/saveeditaccount',params)
                    .then(res =>{
                        //接收后端给来的数据
                        let {code , reason} = res;
                        if(code === 0){
                            //提示
                            this.$message({
                                type:'success',
                                message:reason
                            })
                            const loading = this.$loading({
                                lock: true,
                                text: '正在保存数据...',
                                spinner: 'el-icon-loading',
                                background: 'rgba(0, 0, 0, 0.7)'
                            });
                            setTimeout(() => {
                                    loading.close();
                            }, 2000);
                            //刷新页面
                            this.getAccountListByPage();
                        }else if(code === 1){
                            //提示
                            this.$message.error(reason)
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                    })
            }else{
                //不能提交
                return false;
            }
        })
    },
    //Edit取消按钮
    falseEdit(){
        this.dialogFormVisible = false;
        this.$message({
            type:"success",
            message:"取消成功！"
        })
    },

    // 当选中选择框的状态发生变化，就会触发这个函数，而且传入被选中的数据 val是一个数组
    handleSelectionChange(val) {
      // 获取被选中的id 放入一个数组
      this.selectedId = val.map(v => v.id);
      console.log( this.selectedId )
    },
    // 按照分页请求数据
    getAccountListByPage() {
      // 收集参数
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      // 请求数据
      this.request.get('/account/accountlistbypage', params)
        .then(res => {
          // 接收后端返回的数据
          let {total,  data} = res;
          // 赋值给对应变量
          this.total = total;
          this.accountTableData = data;
          
          // 如果这一页已经没有数据了
          if (!data.length && this.currentPage !== 1) {
            // 回到上一页
            this.currentPage -= 1;
            // 调用自己
            this.getAccountListByPage();
          }
        })
        .catch(err => {
          console.log(err)
        })

    },
    // 每页条数改变
    handleSizeChange(val) {
      // 把每页条数赋值给pageSize
      this.pageSize = val;
       // 调用分页函数
      this.getAccountListByPage();
    },
    // 当前页码改变
    handleCurrentChange(val) {
      // 把页码值赋值给currentPage
      this.currentPage = val;
      // 调用分页函数
      this.getAccountListByPage();
    },

    //取消全选
    cancelSelect() {
      this.$refs.accountTableData.clearSelection() // 选中整个表格 调用函数取消选择
    },
    //批量删除
    batchDel() {
      // 如果没有选中 给出错误提示 结束函数
      if (!this.selectedId.length) {
        // 弹错误提示
        this.$message.error('请选择以后再操作！');
        return
      }

       // 优化删除体验
      this.$confirm('你确定要批量删除吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => { // 确定
        // 收集被选中的数据的id
        let params = {
          idArr: this.selectedId
        }
        // 发送请求给后端 把被选中的id一起发送给后端
        this.request.get('/account/batchdel', params)
          .then(res => {
            // 接收数据
            let {code, reason} = res;
            if (code === 0) {
              // 弹成功提示
              this.$message({
                type: 'success',
                message: reason
              })
              // 刷新列表
              this.getAccountListByPage();
  
            } else if (code === 1) {
              // 弹失败提示
              this.$message.error(reason)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }).catch(() => { // 取消
        this.$message({
            type: 'info',
            message: '已取消删除'
        })
      })
    }
  },
  created(){
      //调用函数
      this.getAccountListByPage();
  },
  filters: {
    // 过滤时间,
    filterDate (time) {
      return moment(time).format('YYYY-MM-DD hh:mm:ss')
    }
  }
};
</script>
<style lang="less">
@import "./Accountmanage.less";
</style>