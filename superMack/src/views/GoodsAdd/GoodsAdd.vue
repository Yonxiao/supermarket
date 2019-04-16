<template>
    <div class="goods-add">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>添加商品</span>
                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
            </div>
            <div class="text item">
                <el-form style="width:400px" :label-position="labelPosition" ref="goodsAdd" label-width="80px" status-icon :rules="rules" :model="goodsAdd">

                    <el-form-item label="所属分类" prop="classify">
                        <el-select v-model="goodsAdd.classify" clearable placeholder="请选择">
                            <el-option label="上装" value="上装"></el-option>
                            <el-option label="下装" value="下装"></el-option>
                            <el-option label="鞋类" value="鞋类"></el-option>
                            <el-option label="配件" value="配件"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="商品条形码" prop="abarcode">
                        <el-input style="width:250px" v-model="goodsAdd.abarcode"></el-input>
                        <el-button type="primary">生成条形码<i class="el-icon-refresh"></i></el-button>
                    </el-form-item>

                    <el-form-item label="商品名称" prop="product">
                        <el-input v-model="goodsAdd.product"></el-input>
                    </el-form-item>


                    <el-form-item label="商品售价" prop="sellingPrice">
                        <el-input style="width:300px" v-model="goodsAdd.sellingPrice"></el-input>元
                    </el-form-item>

                    <el-form-item label="市场价" prop="marketPrice">
                        <el-input style="width:300px" v-model="goodsAdd.marketPrice"></el-input>元
                        <p class="fccc">默认市场价为售价的1.2倍</p>
                    </el-form-item>

                    <el-form-item label="商品进价" prop="PCSalePrice">
                        <el-input style="width:300px" v-model="goodsAdd.PCSalePrice"></el-input>元
                    </el-form-item>


                    <el-form-item label="入库数量" prop="repertory">
                        <el-input v-model="goodsAdd.repertory"></el-input>
                        <p class="fccc">记重商品单位为千克</p>
                    </el-form-item>

                    <el-form-item label="商品重量" prop="weight">
                        <el-input v-model="goodsAdd.weight"></el-input>
                    </el-form-item>

                    <!-- 商品单位 -->
                    <el-form-item label="商品单位" prop="unit">
                        <el-select v-model="goodsAdd.unit" placeholder="请选择单位">
                            <el-option label="个" value="个"></el-option>
                            <el-option label="瓶" value="瓶"></el-option>
                            <el-option label="盒" value="盒"></el-option>
                            <el-option label="g" value="g"></el-option>
                            <el-option label="kg" value="kg"></el-option>
                            <el-option label="条" value="条"></el-option>
                            <el-option label="条" value="条"></el-option>
                            <el-option label="袋" value="袋"></el-option>
                            <el-option label="件" value="件"></el-option>
                            <el-option label="只" value="只"></el-option>
                        </el-select>
                    </el-form-item>
                    

                    <el-form-item label="会员优惠" prop="discount">
                        <el-radio-group v-model="goodsAdd.discount">
                        <el-radio label="享受"></el-radio>
                        <el-radio label="不享受"></el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="是否促销" prop="promotion">
                        <el-radio-group v-model="goodsAdd.promotion">
                        <el-radio label="促销"></el-radio>
                        <el-radio label="不促销"></el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="商品简介" prop="desc">
                        <el-input type="textarea" v-model="goodsAdd.desc"></el-input>
                        <p class="fccc">不超过200个字</p>
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
export default {
    data() {
        return {   
            goodsAdd:{
                //所属分类
                classify: '',
                //商品条形码
                abarcode:'',
                //商品名称
                product:'',
                //商品售价
                sellingPrice:'',
                //市场价
                marketPrice:'',
                //商品进价
                PCSalePrice:'',
                //入库数量
                repertory:'',
                //商品重量
                weight:'',
                //商品单位
                unit:'',
                //会员优惠
                discount: '',
                //是否促销
                promotion: '',
                //商品简介
                desc: ''
            },
            rules:{
                //所属分类
                userGroup:[
                    {required:true,message:'请选择所属分类',trigger:'change'}//非空
                ],
                abarcode:[
                    {required:true,message:'请生成商品条形码',trigger:'blur'}//非空                    
                ],
                product:[
                    {required:true,message:'请输入商品的名称',trigger:'blur'}//非空
                ],
                sellingPrice:[
                    {required:true,message:'请输入商品的售价',trigger:'blur'}//非空
                ],
                marketPrice:[
                    {required:true,message:'请输入商品的市场价',trigger:'blur'}//非空
                ],
                PCSalePrice:[
                    {required:true,message:'请输入商品的进价',trigger:'blur'}//非空
                ],
                repertory:[
                    {required:true,message:'请输入商品入库数量',trigger:'blur'}//非空
                ],
                weight:[
                    {required:true,message:'请输入商品的重量',trigger:'blur'}//非空
                ],
                unit:[
                    {required:true,message:'请输入商品的单位',trigger:'blur'}//非空
                ],
                desc:[
                    {required:true,message:'请输入商品的简介',trigger:'blur'}//非空
                ],
            },
            labelPosition: 'top',
                goodsAdd: {
                    name: '',
                    region: '',
                    type: ''
                }
        }   
    },
        methods:{
         // 添加账号
        submitForm() {
            this.$refs.goodsAdd.validate(valid =>{
                if(valid){
                    let params = {
                        //所属分类
                        classify: this.goodsAdd.classify,
                        //商品条形码
                        abarcode:this.goodsAdd.abarcode,
                        //商品名称
                        product:this.goodsAdd.product,
                        //商品售价
                        sellingPrice:this.goodsAdd.sellingPrice,
                        //市场价
                        marketPrice:this.goodsAdd.marketPrice,
                        //商品进价
                        PCSalePrice:this.goodsAdd.PCSalePrice,
                        //入库数量
                        repertory:this.goodsAdd.repertory,
                        //商品重量
                        weight:this.goodsAdd.weight,
                        //商品单位
                        unit:this.goodsAdd.unit,
                        //会员优惠
                        discount: this.goodsAdd.discount,
                        //是否促销
                        promotion: this.goodsAdd.promotion,
                        //商品简介
                        desc: this.goodsAdd.desc
                    }
                    // console.log(params)

                    //发送axios请求给后端
                    this.request.post('/goods/goodsadd',params)
                        .then(res => {
                        let {code, reason} = res;
                        if (code === 0) {
                            this.$message({
                                type:'success',
                                message: reason
                            })
                            this.$router.push('/home/goodsmanage')
                        } else if (code === 1) {
                            this.$message.error(reason)
                        }
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }else{
                    console.log('前端不对')
                    return;
                }
            })
        },
        //重置
        resetForm(){
            //重置表单
            this.$refs.goodsAdd.resetFields()
        }
    }
}
</script>
<style lang='less'>
    @import './GoodsAdd.less';
</style>