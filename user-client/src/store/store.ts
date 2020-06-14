import Vue from 'vue'
import Vuex from 'vuex'
import {messages} from "@/store/modules/messages"
import {users} from "@/store/modules/users"

Vue.use(Vuex)

export enum RootMutations {
  SET_SNACKBAR = 'SET_SNACKBAR',
}

export interface RootState {
  snackbarContent: string;
  snackbarClass: string;
}

export const store = new Vuex.Store<RootState>({
  modules: {
    messages,
    users
  },

  state: {
    snackbarContent: "",
    snackbarClass: "",
  },

  mutations: {
    [RootMutations.SET_SNACKBAR](state: RootState, {content, klass}) {
      state.snackbarContent = content
      state.snackbarClass = klass
    }
  },

  actions: {
    setSnackbar({commit}, {content, klass}) {
      commit(RootMutations.SET_SNACKBAR, {content, klass})
    },
    clearSnackbar({commit}) {
      commit(RootMutations.SET_SNACKBAR, {content: '', klass: ''})
    }
  }
})
