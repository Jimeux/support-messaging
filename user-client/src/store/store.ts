import Vue from 'vue'
import Vuex, {StoreOptions} from 'vuex'
import messages from "@/store/modules/messages";

Vue.use(Vuex)

export enum RootMutations {
  SET_SNACKBAR = 'SET_SNACKBAR',
}

export interface RootState {
  snackbarContent: string;
  snackbarClass: string;
}

const store: StoreOptions<RootState> = {
  modules: {
    messages
  },

  state: {
    snackbarContent: "",
    snackbarClass: "",
  },

  mutations: {
    [RootMutations.SET_SNACKBAR](state: RootState, {content, klass}) {
      state.snackbarContent = content;
      state.snackbarClass = klass;
    },
  },

  actions: {
    setSnackbar({commit, state}, {content, klass}) {
      commit(RootMutations.SET_SNACKBAR, {content, klass});
    },
    clearSnackbar({commit}) {
      commit(RootMutations.SET_SNACKBAR, {content: '', klass: ''});
    }

  }
};

export default new Vuex.Store<RootState>(store);
