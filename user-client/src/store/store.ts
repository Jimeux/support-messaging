import Vue from 'vue'
import Vuex, {StoreOptions} from 'vuex'
import messages from "@/store/modules/messages";

Vue.use(Vuex)

export interface RootState {
  fuckYouESLint: string;
}

const store: StoreOptions<RootState> = {
  modules: {
    messages
  },

  state: {
    fuckYouESLint: "fuck off"
  },

  mutations: {},

  actions: {}
};

export default new Vuex.Store<RootState>(store);
