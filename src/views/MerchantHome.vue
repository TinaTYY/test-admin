<template>
    <div id="menu">
        <MerchantHeader/>
        <router-view/>
    </div>
</template>

<script>
    import  MerchantHeader from  '@/components/MerchantHeader'
    export default {
        name: "MerchantHome",
        components:{
            MerchantHeader
        },
        beforeMount(){
        },
        mounted(){
            this.$indicator.close()
        }
    }
</script>

<style lang="scss">

</style>