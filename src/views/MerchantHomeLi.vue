<template>
    <div class="menuList" v-infinite-scroll="loadMore"
         infinite-scroll-disabled="loading"
         infinite-scroll-distance="10">
        <div class="order_lis_li" v-for="(i,j) in orderList" :key="j">
            <div class="order_header" @click="openMore()">
                <div class="order_num">
                    订单号:{{i.orderNumber}}
                </div>
                <div class="order_more">
                    <button><img src="../assets/img/more.png"/></button>
                </div>
            </div>
            <div class="order_content">
                <div class="order_status">
                    <span>{{orderStatus(i.orderStatus)}}</span>
                </div>
                <div class="order_name">
                    收货人：{{i.consigneeName}} {{i.phone}}
                </div>

            </div>
            <div class="order_set">
                <div class="order_address">
                    收货地址：{{i.address}}
                </div>
                <div class="order_map">
                    <button @click="openMap(i.latitude,i.longitude,i.address)"><img src="../assets/img/localtion.png"/>导航</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import configBase from '@/plugins/config'

    export default {
        name: "MerchantHome",
        data() {
            return {
                latitude: null,
                orderList: [],
                longitude: null,
                name: '',
                currentPage: 0,
                orderStatusList: configBase.orderStatusList
            }
        },
        mounted() {
            this.$indicator.close();
        },
        components: {},
        filters: {},
        methods: {
            loadMore(){
                this.currentPage++;
                this.getOrderList();
            },
            orderStatus(val) {
                let value = this.orderStatusList.filter((i) => {
                    if (val == i.status) {
                        return i
                    }
                });
                return value[0].value
            },
            getOrderList() {
                let vm = this, data = {
                    isShowAll:0,
                    showCount:10,
                    currentPage:vm.currentPage
                };
                vm.load=true;
                getAxios('/merchant/order/courier/getTakeOutOrderList', data).then(res => {
                    let {code, entity} = res.data;
                    if (code == 200) {
                        let lgh=entity.pageInfo.data.length;
                        if(lgh!=0&&lgh%10!=0){
                            vm.load=false
                        }
                        vm.orderList = entity.pageInfo.data
                    }
                }).then(err => {

                })
            },
            openMore(orderId) {
                this.$router.push({path: '/MerchantOrderMore', params: {orderId}})
            },
            getLatLng() {
                let vm = this;
                wx.ready(function () {
                    wx.getLocation({
                        type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                        success: function (res) {
                            vm.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                            vm.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                            vm.speed = res.speed; // 速度，以米/每秒计
                            vm.accuracy = res.accuracy; // 位置精度
                        }
                    })
                })
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
            }
        }
    }
</script>

<style>

</style>