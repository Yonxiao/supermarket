<template>
    <div class="system-info">
    <!-- 面板 -->
    <el-card class="box-card">
      <!-- 头部 -->
      <div slot="header" class="clearfix">
        <span>系统信息</span>
      </div>
      <!-- 内容 -->
      <div class="text item">
          <div>
            <el-alert
                title="商品总数:5，已经销售的总金额:890.00.库存商品总价:1235.82"
                type="success"
                show-icon>
            </el-alert>
            <el-alert
                title="导入数据"
                type="success"
                show-icon>
            </el-alert>
          </div>
          <!-- 下面 -->
          <div>
            <el-row :gutter="20">
                <el-col :span="14">
                    <div class="grid-content bg-purple">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>销售排行</span>
                            </div>
                            <el-table
                                :data="tableData2"
                                style="width: 100%"
                                :row-class-name="tableRowClassName">
                                <el-table-column
                                prop="date"
                                label="商品名称">
                                </el-table-column>
                                <el-table-column
                                prop="xiaoliang"
                                align="right"
                                label="销量">
                                </el-table-column>
                            </el-table>
                        </el-card>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="grid-content bg-purple">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>缺货的商品</span>
                            </div>
                            <el-table
                                :data="tableData2"
                                style="width: 100%"
                                :row-class-name="tableRowClassName">
                                <el-table-column
                                prop="date"
                                label="商品名称">
                                </el-table-column>
                                <el-table-column
                                prop="name"
                                label="库存">
                                </el-table-column>
                                <el-table-column
                                prop="caozuo"
                                label="操作">
                                </el-table-column>
                            </el-table>
                        </el-card>
                    </div>
                </el-col>
            </el-row>
          </div>
      </div>
    </el-card>
    </div>
</template>
<script>
export default {
    methods: {
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      }
    },
    data() {
      return {
        tableData2: [{
          date: '男子运动服1',
          name: '23',
          address: '上海市普陀区金沙江路 1518 弄',
          xiaoliang:'50',
          caozuo:'张入中'
        }, {
          date: '男子运动服2',
          name: '25',
          address: '上海市普陀区金沙江路 1518 弄',
          xiaoliang:'50',
          caozuo:'张入中'
        }, {
          date: '男子运动服3',
          name: '28',
          address: '上海市普陀区金沙江路 1518 弄',
          xiaoliang:'50',
          caozuo:'张入中'
        }, {
          date: '男子运动服4',
          name: '28',
          address: '上海市普陀区金沙江路 1518 弄',
          xiaoliang:'50',
          caozuo:'张入中'
        }]
      }
    }
  }
</script>
<style lang="less">
.system-info{
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
            .el-alert{
                margin: 20px 0;
                border-radius: 50px;
            }
            .el-table .warning-row {
                background: oldlace;
            }

            .el-table .success-row {
                background: #f0f9eb;
            }
        }
    }
}
</style>