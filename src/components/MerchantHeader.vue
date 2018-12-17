<template>
    <div class="MerchantHeader" >
        <div class="MerchantName">{{merchantNameM}}</div>
        <div class="MerchantUser">
           配送员:{{MerchantUser}}
        </div>
    </div>
</template>

<script>

    export default {
        name: "headFor",
        data() {
            return {
                MerchantUser:'' ,
                merchantNameM: ''
            }
        },
        methods: {

        },
        watch: {

        },
        mounted() {
            this.$indicator.close();
            this.MerchantUser =localStorage.getItem('nameM');
            this.merchantNameM =localStorage.getItem('merchantNameM');
        },

    }
</script>

<style lang="scss">
    #Detailed {
        width: 100%;
        overflow: auto;
        box-sizing: border-box;
        img {
            border: none;
        }
    }
</style>