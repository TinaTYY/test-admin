<template>
    <div id="order_more">
        <div class="order_menu">
            <div class="backHome" @click="$router.push('/MerchantHome')"><img src="@/assets/img/backWine.png" alt="返回">
            </div>
            <div class="order_merchant_phone" v-if="orderInfo&&orderInfo.merchantPhone"><a :href="'tel:'+orderInfo.merchantPhone"><i class="iconfont icon-shouji"></i><span>联系店家</span> </a></div>
        </div>
        <div class="order_content" v-if="orderInfo&&orderInfo.orderStatus">
            <div class="orderuserInfo">
                <div class="title">{{orderStatus(orderInfo.orderStatus )}}</div>
                <div class="order_user_phone">
                    <div class="sub_title">收货人:&nbsp;&nbsp;{{orderInfo.consigneeName }} {{orderInfo.courierPhone }} </div>
                    <div class="sub_val"></div>
                </div>
                <div class="order_user_advice">
                    <div class="sub_title">配送地址:&nbsp;&nbsp;{{orderInfo.address }} </div>
                    <div class="sub_val"><div class="order_map"><button @click="openMap(i.latitude,i.longitude,i.address)"><img src="../assets/img/localtion.png"/>导航</button></div></div>
                </div>
            </div>
            <div class="order_verify_send">
                <div class="title">输入收货验证码</div>
                <div class="order_verify_code">
                    <label>
                        <input type="text" placeholder="收货码" max="4" v-model="deliveryCode">
                    </label>
                    <button @click="enterOrder">确认收货</button>
                </div>
            </div>

            <div class="goods_list">
                <div class="title">商品信息</div>
                <div class="order_goods_li" v-for="(i,j) in orderInfo.resOrderDetaiGoodsInfoList" :key="j">
                    <div class="order_goods_name">
                        <span class="name">{{i.goodsChName}}</span>
                        <span class="order_goods_num">X {{i.goodsCount}}</span></div>
                    <div class="order_goods_price">
                        {{i.goodsEnName}} <span class="order_goods_num">￥{{i.price}}</span></div>
                </div>
                <div class="order_goods_delivery_fee">
                    <div class="sub_title">运费:</div>
                    <div class="sub_val">￥{{orderInfo.freight}}</div>
                </div>
                <div class="order_goods_weight">
                    <div class="sub_title">商品重量:</div>
                    <div class="sub_val"> {{orderInfo.weightFreight}}g</div>
                </div>
                <div class="order_goods_all_price">
                    <div class="sub_title">商品总价格:</div>
                    <div class="sub_val"> {{orderInfo.sumOrder}}</div>
                </div>
            </div>
            <div class="orderInfo">
                <div class="title">订单信息</div>
                <div class="order_num">
                    <div class="sub_title">订单号:</div>
                    <div class="sub_val">{{orderInfo.orderNum}}</div>
                </div>
                <div class="order_pay">
                    <div class="sub_title">支付方式:</div>
                    <div class="sub_val">{{orderInfo.payWay?orderInfo.payWay:'在线支付'}}</div>
                </div>
                <div class="order_time">
                    <div class="sub_title">下单时间:</div>
                    <div class="sub_val">{{orderInfo.orderTime}}</div>
                </div>
                <div class="order_delivery_time">
                    <div class="sub_title">配送开始时间:</div>
                    <div class="sub_val">{{orderInfo.orderTime}}</div>
                </div>
                <div class="order_delivery_time">
                    <div class="sub_title">预计送达时间:</div>
                    <div class="sub_val">{{orderInfo.estimatedServiceTime}}</div>
                </div>
            </div>
        </div>
        <div class="info" v-else>
            暂无数据
        </div>
    </div>
</template>

<script>
    import configBase from '@/plugins/config'
    export default {
        name: "MenuDetailed",
        data() {
            return {
                currentPage: 0,
                showCount: 10,
                infoList: [],
                orderInfo: {},
                orderId: null,
                loading: true,
                deliveryCode: '',
                orderStatusList: configBase.orderStatusList
            }
        },
        components: {},
        beforeMount() {
            // let order = this.$route.params.orderId;
            let order = 135;
            if (!order && order == '') {
                this.$toast('订单Id为空');
                return
            }
            this.orderId = order || '';
            this.loading = true;
        },
        methods: {
            orderStatus(val) {
                let value = this.orderStatusList.filter((i) => {
                    if (val == i.status) {
                        return i
                    }
                });
                return value[0].value
            },
            openMap(lat, lng, name) {
                wx.openLocation({
                    latitude: lat, // 纬度，浮点数，范围为90 ~ -90
                    longitude: lng, // 经度，浮点数，范围为180 ~ -180。
                    name: name, // 位置名
                    address: '', // 地址详情说明
                    scale: 13, // 地图缩放级别,整形值,范围从1~28。默认为最大
                    infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
                })
            },
            enterOrder() {
                let vm = this, params = {
                    orderId: vm.orderId,
                    deliveryCode: vm.deliveryCode
                };
                if (!params.deliveryCode && params.deliveryCode == '') {
                    this.$toast('请输入收获码');
                    return
                }
                postAxios('/merchant/order/courier/confirmDelivery', params).then(res => {
                    let {code, entity} = res.data;
                    if (code == 200) {
                        vm.orderInfo = entity
                    }
                }).catch(err => {

                })
            },
            getOrderInfo() {
                let vm = this, params = {
                    orderId: vm.orderId
                };
                getAxios('/merchant/order/getMerchantTakeOutOrderInfo', params).then(res => {
                    let {code, entity} = res.data;
                    if (code == 200) {
                        this.orderInfo = entity
                    }
                }).catch(err => {

                })
            },
        },
        mounted() {
            this.$indicator.close();
            this.getOrderInfo()
        }
    }
</script>

<style lang="scss">
    .info{
        line-height: 60px;
        text-align: center;
        color: #fff;
    }
    #order_more {
        overflow: scroll;
        height: 100%;
        .order_menu {
            width: 100%;
            padding: 0 20px;
            box-sizing: border-box;
            height: 40px;
            display: flex;
            justify-content: space-between;
            line-height: 40px;
            font-size: 10px;
            font-family: PingFang-SC-Bold;
            font-weight: bold;
            color: #9B9B9B;
            .backHome {
                width: 20px;
                img {
                    width: 100%;
                    vertical-align: middle;
                }
            }
        }
        .order_content {
            width: 100%;
            max-width: 750px;
            box-sizing: border-box;
            padding: 0 20px;
            color: #fff;
            .order_goods_name, .order_goods_price {
                display: flex;
                justify-content: space-between;
            }
            & > div {
                background: rgba(35, 35, 36, 0.84);
                font-size: 10px;
                border-radius: 4px;
                box-sizing: border-box;
                padding: 0 10px 20px;
                color: #a8a8a8;
                margin-bottom: 20px;
                line-height: 18px;
                & > div {
                    display: flex;
                    justify-content: space-between;
                }
                &.orderuserInfo {
                    background: transparent;
                    .title {
                        color: #fff;
                    }
                }
                &.goods_list, &.orderInfo {
                    line-height: 18px;
                    .title {
                        border-bottom: 1px solid #303032;
                    }
                    .order_num {
                        margin-top: 5px;
                    }
                }
                &.orderInfo > div, &.goods_list > div {
                    display: flex;
                    justify-content: space-between;
                    &.order_goods_li {
                        display: block;
                        border-bottom: 1px solid #303032;
                        font-size: 10px;
                        padding: 10px 0;

                    }
                }
            }
            .order_merchant_img {
                display: flex;
            }
            .title {
                font-size: 10px;
                font-family: PingFang-SC-Regular;
                font-weight: 400;
                color: #9B9B9B;
                line-height: 34px;
                padding: 0;
            }
            .order_goods_delivery_fee {
                margin-top: 5px;
            }
            .order_verify_code {
                display: flex;
                label {
                    flex: auto;
                }
                input {
                    width: 100%;
                    height: 24px;
                    font-size: 14px;
                    background: transparent;
                    border-bottom: 1px solid #4A4A4A;
                    margin-right: 2px;
                    color: #fff;
                    &::placeholder {
                    }
                }
                button {
                    height: 24px;
                    border: none;
                    width: 86px;
                    margin-left: 20px;
                    background: #303032;
                    display: inline-block;
                    outline: none;
                    font-size: 10px;
                    font-family: PingFang-SC-Regular;
                    font-weight: 400;
                    color: #9B9B9B;
                }

            }
        }
    }
    i.iconfont.icon-shouji {
        vertical-align: middle;
    }
    span {
        &.name {
            font-size: 14px;
            font-weight: bold;
            color: #fff;
        }
    }
</style>