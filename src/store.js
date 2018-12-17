import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        WineCard:'',
        userDate: {
            accessToken:localStorage.getItem('accessTokenM'),
            merchantBaseInfoId:localStorage.getItem('merchantBaseInfoIdM'),
            name:localStorage.getItem('nameM'),
            userName:localStorage.getItem('userNameM'),
            headImagePath:localStorage.getItem('headImagePathM'),
            remark:localStorage.getItem('remarkM'),
            perms:(localStorage.getItem('permsM')||'').split(','),
        }
    },
    mutations: {
        setWineCard(state,data){
            state.WineCard=data
        }
    },
    actions: {}
});
//# sourceMappingURL=store.js.map