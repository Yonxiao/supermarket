<template>
  <div class="goods-manage">
    <!-- 面板 -->
    <el-card class="box-card">
      <!-- 头部 -->
      <div slot="header" class="clearfix">
        <span>商品管理</span>
      </div>
      <!-- 内容 -->
      <div class="text item">
        <!-- 查询 -->
        <div>
          <el-form size="mini" :inline="true" :model="searchForm" class="demo-form-inline">
            <!-- 分类 -->
            <el-form-item label="选择分类" prop="cateName">
                <el-select v-model="searchForm.cateName" placeholder="请选择分类">
                  <el-option label="全部" value="全部"></el-option>
                  <el-option label="上装" value="上装"></el-option>
                  <el-option label="下装" value="下装"></el-option>
                  <el-option label="鞋类" value="鞋类"></el-option>
                  <el-option label="配件" value="配件"></el-option>
                </el-select>
            </el-form-item>
            <!-- 关键字 -->
            <el-form-item label="关键字">
              <el-input v-model="searchForm.keyword" placeholder="商品名称或条形码"></el-input>
            </el-form-item>
            <!-- 查询按钮 -->
            <el-form-item>
              <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 表格 -->
        <el-table
            @selection-change="handleSelectionChange"
            ref="goodsTableData"
            :data="goodsTableData"
            tooltip-effect="dark"
            style="width: 100%">

                <el-table-column
                type="selection"
                width="55">
                </el-table-column>

                <el-table-column
                prop="barCode"
                label="商品条形码">
                </el-table-column>

                <el-table-column
                prop="goodsName"
                label="商品名称">
                </el-table-column>

                <el-table-column
                prop="cateName"
                label="所属分类">
                </el-table-column>

                <el-table-column
                prop="marketPrice"
                label="市场价(元)">
                </el-table-column>

                <el-table-column
                prop="salePrice"
                label="售价(元)">
                </el-table-column>

                <el-table-column
                prop="goodsNum"
                label="库存">
                </el-table-column>

                <!-- 账号创建日期 -->
                <el-table-column label="日期">
                    <template slot-scope="scope">{{ scope.row.ctime | filterDate }}</template>
                </el-table-column>

                <!-- 操作 -->
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button
                            size="mini"
                            type="primary"
                            @click="handleEdit(scope.row.id)"
                            >
                            <i class="el-icon-edit"></i>
                        </el-button>
                        <!-- 删除按钮 -->
                        <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.row.id)"
                            >
                            <i class="el-icon-delete"></i>
                        </el-button>
                    </template>
                </el-table-column>
        </el-table>

        <!-- 修改模态框 -->
        <el-dialog width="400px" title="修改商品信息" :visible.sync="dialogFormVisible">
          <!-- 修改表单 -->
          <el-form :model="editForm" :rules="rules" ref="editForm">

            <!-- 商品名称 -->
            <el-form-item prop="product" style="width: 320px;" label="商品名称" label-width="100px">
              <el-input v-model="editForm.product" auto-complete="off"></el-input>
            </el-form-item>

            <!-- 分类 -->
            <el-form-item prop="classify" label="选择分类" label-width="100px">
              <el-select v-model="editForm.classify" placeholder="请选择分类">
                <el-option label="上装" value="上装"></el-option>
                <el-option label="下装" value="下装"></el-option>
                <el-option label="鞋类" value="鞋类"></el-option>
                <el-option label="配件" value="配件"></el-option>
              </el-select>
            </el-form-item>

          <!-- 商品售价 -->
          <el-form-item prop="sellingPrice" style="width:300px" label="商品售价" label-width="100px">
            <el-input v-model="editForm.sellingPrice" auto-complete="off"></el-input>
          </el-form-item>

          <!-- 市场价 -->
          <el-form-item prop="marketPrice" style="width:300px" label="市场价" label-width="100px">
            <el-input v-model="editForm.marketPrice" auto-complete="off"></el-input>
          </el-form-item>

          <!-- 入库数量 -->
          <el-form-item prop="repertory" style="width:300px" label="入库数量" label-width="100px">
            <el-input v-model="editForm.repertory" auto-complete="off"></el-input>
          </el-form-item>

          <!-- 会员优惠 -->
          <el-form-item label="会员优惠" prop="discount">
              <el-radio-group v-model="editForm.discount">
              <el-radio label="享受" value="享受"></el-radio>
              <el-radio label="不享受" value="不享受"></el-radio>
              </el-radio-group>
          </el-form-item>

          <!-- 是否促销 -->
          <el-form-item label="是否促销" prop="promotion">
              <el-radio-group v-model="editForm.promotion">
              <el-radio label="促销" value="促销"></el-radio>
              <el-radio label="不促销" value="不促销"></el-radio>
              </el-radio-group>
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
import moment from "moment";

export default {
  data() {
    return {
      searchForm: {
        // 搜索表格数据
        cateName: "",
        keyword: ""
      },
      goodsTableData: [
        // 表格数据
      ],
      editForm: { // 修改模态框的数据对象
          product: '',
          classify: '',
          sellingPrice: '',
          marketPrice: '',
          repertory: '',
          discount: '',
          promotion:''
      },
      editId: "", //要修改的数据id
      dialogFormVisible: false, // 模态框的显示和隐藏状态
      formLabelWidth: "100px", // 修改表单标签的宽度
      dialogFormVisible: false, // 模态框显示隐藏
      rules: {}, // 验证规则
      currentPage: 1, // 当前页码
      pageSize: 3, // 每页条数
      total: 0, // 总条数
      selectedId:[]
    };
  },
  methods: {
    //请求账号数据
    // getGoodsList() {
    //   this.request
    //     .get("/goods/goodslist")
    //     .then(res => {
    //       this.goodsTableData = res;
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },

    getGoodsListByPage() {
      // 收集参数
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        cateName: this.searchForm.cateName,
        keyword: this.searchForm.keyword
      };
      this.request
        .get("/goods/goodslistbypage", params)
        .then(res => {
          // 接收后端响应的数据
          let { total, data } = res;
          // 赋值给对应的变量
          this.goodsTableData = data;
          console.log(this.goodsTableData);
          
          this.total = total;
          // 分页bug处理
          if (this.currentPage !== 1 && !data.length) {
            this.currentPage -= 1;
            this.getGoodsListByPage();
            this.search();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 删除
    handleDelete(id) {
      //删除弹出提示框
      this.$confirm("此操作将永久删除该账号, 是否继续?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.request
            .get("/goods/delete", { id })
            .then(res => {
              //接收后端的数据
              let { code, reason } = res;
              //判断
              if (code === 0) {
                //提示
                this.$notify({
                    title: reason,
                    message: '刚刚您删除了一条用户信息！',
                });
                const loading = this.$loading({
                  lock: true,
                  text: "正在删除...",
                  spinner: "el-icon-loading",
                  background: "rgba(0, 0, 0, 0.7)"
                });
                setTimeout(() => {
                  loading.close();
                }, 2000);
                //刷新页面
                this.getGoodsListByPage();
              } else if (code === 1) {
                //提示
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
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
      this.request
        .get("/goods/editgoods", { id })
        .then(res => {
          //数据回填
          this.editForm.product = res[0].goodsName;
          this.editForm.classify = res[0].cateName;
          this.editForm.sellingPrice = res[0].costPrice;
          this.editForm.marketPrice = res[0].marketPrice;
          this.editForm.repertory = res[0].goodsNum;
          this.editForm.discount = res[0].discount;
          this.editForm.promotion = res[0].promotion;
        })
        .catch(err => {
          console.log(err);
        });
      console.log(id);
    },
    //保存修改数据
    saveEdit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          //前端验证通过
          //关闭模块
          this.dialogFormVisible = false;

          //收集参数
          let params = {
            product: this.editForm.product,
            classify: this.editForm.classify,
            sellingPrice: this.editForm.sellingPrice,
            marketPrice: this.editForm.marketPrice,
            repertory: this.editForm.repertory,
            discount: this.editForm.discount,
            promotion: this.editForm.promotion,
            editId: this.editId
          };
          //发送请求把新数据 和原来的id一起发送给后端
          this.request
            .post("/goods/saveeditaccount", params)
            .then(res => {
              //接收后端给来的数据
              let { code, reason } = res;
              if (code === 0) {
                //提示
                this.$notify({
                    title: reason,
                    message: '刚刚您修改了一条商品信息！',
                });
                const loading = this.$loading({
                  lock: true,
                  text: "正在保存数据...",
                  spinner: "el-icon-loading",
                  background: "rgba(0, 0, 0, 0.7)"
                });
                setTimeout(() => {
                  loading.close();
                }, 2000);
                //刷新页面
                this.getGoodsListByPage();
              } else if (code === 1) {
                //提示
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          //不能提交
          return false;
        }
      });
    },
    //Edit取消按钮
    falseEdit() {
      this.dialogFormVisible = false;
      this.$message({
        type: "success",
        message: "取消成功！"
      });
    },
    //查询
    search() {
      //收集查询参数
      let params = {
        cateName: this.searchForm.cateName,
        keyword: this.searchForm.keyword
      };

      //发送请求
      this.request
        .get("/goods/search", params)
        .then(res => {
          //  接收后端响应的查询结果 赋值给
          this.goodsTableData = res;
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 当选中选择框的状态发生变化，就会触发这个函数，而且传入被选中的数据 val是一个数组
    handleSelectionChange(val) {
      // 获取被选中的id 放入一个数组
      this.selectedId = val.map(v => v.id);
      console.log(this.selectedId);
    },
    // 每页条数改变
    handleSizeChange(val) {
      // 把每页条数赋值给pageSize
      this.pageSize = val;
      // 调用分页函数
      this.getGoodsListByPage();
    },
    // 当前页码改变
    handleCurrentChange(val) {
      // 把页码值赋值给currentPage
      this.currentPage = val;
      // 调用分页函数
      this.getGoodsListByPage();
    },

    //取消全选
    cancelSelect() {
      this.$refs.goodsTableData.clearSelection(); // 选中整个表格 调用函数取消选择
    },
    //批量删除
    batchDel() {
      // 如果没有选中 给出错误提示 结束函数
      if (!this.selectedId.length) {
        // 弹错误提示
        this.$message.error("请选择以后再操作！");
        return;
      }

      // 优化删除体验
      this.$confirm("你确定要批量删除吗?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 确定
          // 收集被选中的数据的id
          let params = {
            idArr: this.selectedId
          };
          // 发送请求给后端 把被选中的id一起发送给后端
          this.request
            .get("/goods/batchdel", params)
            .then(res => {
              // 接收数据
              let { code, reason } = res;
              if (code === 0) {
                // 弹成功提示
                this.$notify({
                    title: reason,
                    message: '刚刚您删除了一条用户信息！',
                });
                // 刷新列表
                this.getGoodsListByPage();
              } else if (code === 1) {
                // 弹失败提示
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          // 取消
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  created() {
    //调用函数
    this.getGoodsListByPage();
  },
  filters: {
    // 过滤时间,
    filterDate(val) {
      return moment(val).format("YYYY-MM-DD hh:mm:ss");
    }
  }
};
</script>
<style lang="less">
@import "./GoodsManage.less";
</style>