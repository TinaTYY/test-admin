<template>
    <div id="notFound" @click="herf">
        <img src="../assets/img/404.png"/>
        <p><img src="../assets/img/rehsh.png"/>  <span>返回</span></p>
    </div>
</template>

<script>
    export default {
        name: "NotFound",
        methods:{
            herf(){
                this.$router.push('/')
            }
        },
        mounted(){
            this.$indicator.close()
        }
    }
</script>

<style scoped lang="scss">


</style>