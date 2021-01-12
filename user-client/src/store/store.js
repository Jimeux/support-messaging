import Vue from 'vue';
import Vuex from 'vuex';
import { messages } from "@/store/modules/messages";
import { users } from "@/store/modules/users";
Vue.use(Vuex);
export var RootMutations;
(function (RootMutations) {
    RootMutations["SET_SNACKBAR"] = "SET_SNACKBAR";
})(RootMutations || (RootMutations = {}));
export const store = new Vuex.Store({
    modules: {
        messages,
        users
    },
    state: {
        snackbarContent: "",
        snackbarClass: "",
    },
    mutations: {
        [RootMutations.SET_SNACKBAR](state, { content, klass }) {
            state.snackbarContent = content;
            state.snackbarClass = klass;
        }
    },
    actions: {
        setSnackbar({ commit }, { content, klass }) {
            commit(RootMutations.SET_SNACKBAR, { content, klass });
        },
        clearSnackbar({ commit }) {
            commit(RootMutations.SET_SNACKBAR, { content: '', klass: '' });
        }
    }
});
//# sourceMappingURL=store.js.map