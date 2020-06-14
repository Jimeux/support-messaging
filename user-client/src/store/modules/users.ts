import {ActionContext, Module} from "vuex";
import {RootState} from "@/store/store";
import {User, UserSummary} from "@/data/user";
import UserRepository from "@/api/userRepository";

// todo how to inject?
const userRepo = new UserRepository();

export interface UserState {
  userSummaries: Array<UserSummary>;
  activeUserId: number | null;
  activeUserSummary: UserSummary | null;
  activeUser: User | null;
  loadingSummaries: boolean;
  loadingUser: boolean;
}

enum mutations {
  SET_ACTIVE_USER_ID = 'SET_ACTIVE_USER_ID',
  SELECT_USER = 'SELECT_USER',
  ADD_USER_SUMMARIES = 'ADD_USER_SUMMARIES',
  SET_USER = 'SET_USER',
  SET_LOADING_SUMMARIES = 'SET_LOADING_SUMMARIES',
  SET_LOADING_USER = 'SET_LOADING_USER',
}

export enum UserActions {
  selectUser = 'selectUser',
  setActiveUserId = 'setActiveUserId',
  fetchUserSummaries = 'fetchUserSummaries'
}

export const UserNamespace = "users";

export const users: Module<UserState, RootState> = {
  namespaced: true,

  state: {
    activeUserId: null,
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

    [mutations.SET_ACTIVE_USER_ID](state: UserState, userId: number) {
      state.activeUserId = userId;
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
    [UserActions.setActiveUserId](ctx: ActionContext<UserState, RootState>, id: number) {
      ctx.commit(mutations.SET_ACTIVE_USER_ID, id);
    },

    async [UserActions.fetchUserSummaries](ctx: ActionContext<UserState, RootState>) {
      try {
        ctx.commit(mutations.SET_LOADING_SUMMARIES, true);
        const us = await userRepo.fetchUserSummaries();
        ctx.commit(mutations.ADD_USER_SUMMARIES, us);

        if (ctx.state.activeUserId != null)
          ctx.dispatch("selectUser", ctx.state.activeUserId).then();
      } catch (err) {
        await ctx.dispatch("setSnackbar", {content: err.message, klass: "error"}, {root: true});
      } finally {
        ctx.commit(mutations.SET_LOADING_SUMMARIES, false);
      }
    },

    async [UserActions.selectUser](ctx: ActionContext<UserState, RootState>, id: number ) {
      try {
        const found = ctx.state.userSummaries.find(u => u.userId === id)
        if (found === undefined) {
          const payload = {content: `User summary not found for id ${id}`, klass: "error"};
          await ctx.dispatch("setSnackbar", payload, {root: true});
          return;
        }

        ctx.commit(mutations.SELECT_USER, found);
        ctx.commit(mutations.SET_LOADING_USER, true);

        const user = await userRepo.fetchUser(id);
        ctx.commit(mutations.SET_USER, user);
      } catch (err) {
        await ctx.dispatch("setSnackbar", {content: err.message, klass: "error"}, {root: true})
      } finally {
        ctx.commit(mutations.SET_LOADING_USER, false);
      }
    }

  }
};
