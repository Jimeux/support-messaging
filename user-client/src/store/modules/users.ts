import {Module} from "vuex";
import {RootState} from "@/store/store";
import {User, UserSummary} from "@/data/user";
import UserRepository from "@/api/userRepository";

// todo how to inject?
const userRepo = new UserRepository();

export const UserNamespace = "users";

export interface UserState {
  userSummaries: Array<UserSummary>;
  activeUserSummary: UserSummary | null;
  activeUser: User | null;
  loadingSummaries: boolean;
  loadingUser: boolean;
}

enum mutations {
  SELECT_USER = 'SELECT_USER',
  ADD_USER_SUMMARIES = 'ADD_USER_SUMMARIES',
  SET_USER = 'SET_USER',
  SET_LOADING_SUMMARIES = 'SET_LOADING_SUMMARIES',
  SET_LOADING_USER = 'SET_LOADING_USER',
}

const userModule: Module<UserState, RootState> = {
  namespaced: true,

  state: {
    activeUserSummary: null,
    activeUser: null,
    userSummaries: [],
    loadingSummaries: false,
    loadingUser: false
  },

  getters: {},

  mutations: {
    [mutations.SELECT_USER](state: UserState, us: UserSummary) {
      state.activeUserSummary = us;

      // init
      state.activeUser = null;
    },
    [mutations.SET_USER](state: UserState, user: User) {
      state.activeUser = user;
    },
    [mutations.SET_LOADING_SUMMARIES](state: UserState, loading: boolean) {
      state.loadingSummaries = loading;
    },
    [mutations.SET_LOADING_USER](state: UserState, loading: boolean) {
      state.loadingUser = loading;
    },
    [mutations.ADD_USER_SUMMARIES](state: UserState, us: Array<UserSummary>) {
      state.userSummaries = us;
    }
  },

  actions: {
    async fetchUserSummaries({commit, dispatch}) {
      try {
        commit(mutations.SET_LOADING_SUMMARIES, true);
        const us = await userRepo.fetchUserSummaries();
        commit(mutations.ADD_USER_SUMMARIES, us);
      } catch (err) {
        dispatch("setSnackbar", {content: err.message, klass: "error"}, {root: true});
      } finally {
        commit(mutations.SET_LOADING_SUMMARIES, false);
      }
    },
    async selectUser({commit, state, dispatch}, id: number) {
      try {
        const found = state.userSummaries.find(u => u.userId === id)
        if (found === undefined) {
          dispatch("setSnackbar", {content: `User summary not found for id ${id}`, klass: "error"}, {root: true})
        }

        commit(mutations.SELECT_USER, found);
        commit(mutations.SET_LOADING_USER, true);

        const user = await userRepo.fetchUser(id);
        commit(mutations.SET_USER, user);
      } catch (err) {
        dispatch("setSnackbar", {content: err.message, klass: "error"}, {root: true})
      } finally {
        commit(mutations.SET_LOADING_USER, false);
      }
    }
  }
};

export default userModule;
