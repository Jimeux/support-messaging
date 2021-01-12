import UserRepository from "@/api/userRepository";
// todo how to inject?
const userRepo = new UserRepository();
var mutations;
(function (mutations) {
    mutations["SET_ACTIVE_USER_ID"] = "SET_ACTIVE_USER_ID";
    mutations["SELECT_USER"] = "SELECT_USER";
    mutations["ADD_USER_SUMMARIES"] = "ADD_USER_SUMMARIES";
    mutations["SET_USER"] = "SET_USER";
    mutations["SET_LOADING_SUMMARIES"] = "SET_LOADING_SUMMARIES";
    mutations["SET_LOADING_USER"] = "SET_LOADING_USER";
})(mutations || (mutations = {}));
export var UserActions;
(function (UserActions) {
    UserActions["selectUser"] = "selectUser";
    UserActions["setActiveUserId"] = "setActiveUserId";
    UserActions["fetchUserSummaries"] = "fetchUserSummaries";
    UserActions["search"] = "search";
})(UserActions || (UserActions = {}));
export const UserNamespace = "users";
export const users = {
    namespaced: true,
    state: {
        activeUserId: null,
        activeUserSummary: null,
        activeUser: null,
        userSummaries: [],
        loadingSummaries: false,
        loadingUser: false,
        users: []
    },
    getters: {},
    mutations: {
        [mutations.SELECT_USER](state, us) {
            state.activeUserSummary = us;
            // init
            state.activeUser = null;
        },
        [mutations.SET_ACTIVE_USER_ID](state, userId) {
            state.activeUserId = userId;
        },
        [mutations.SET_USER](state, user) {
            state.users.push(user);
            state.activeUser = user;
        },
        [mutations.SET_LOADING_SUMMARIES](state, loading) {
            state.loadingSummaries = loading;
        },
        [mutations.SET_LOADING_USER](state, loading) {
            state.loadingUser = loading;
        },
        [mutations.ADD_USER_SUMMARIES](state, us) {
            state.userSummaries = us;
        }
    },
    actions: {
        [UserActions.setActiveUserId](ctx, id) {
            ctx.commit(mutations.SET_ACTIVE_USER_ID, id);
        },
        async [UserActions.fetchUserSummaries](ctx) {
            try {
                ctx.commit(mutations.SET_LOADING_SUMMARIES, true);
                const us = await userRepo.fetchUserSummaries();
                ctx.commit(mutations.ADD_USER_SUMMARIES, us);
                if (ctx.state.activeUserId != null)
                    ctx.dispatch("selectUser", ctx.state.activeUserId).then();
            }
            catch (err) {
                await ctx.dispatch("setSnackbar", { content: err.message, klass: "error" }, { root: true });
            }
            finally {
                ctx.commit(mutations.SET_LOADING_SUMMARIES, false);
            }
        },
        async [UserActions.search](ctx, id) {
            try {
                ctx.commit(mutations.SET_LOADING_SUMMARIES, true);
                const us = await userRepo.userSummariesById(id);
                ctx.commit(mutations.ADD_USER_SUMMARIES, us);
            }
            catch (err) {
                await ctx.dispatch("setSnackbar", { content: err.message, klass: "error" }, { root: true });
            }
            finally {
                ctx.commit(mutations.SET_LOADING_SUMMARIES, false);
            }
        },
        async [UserActions.selectUser](ctx, id) {
            try {
                const found = ctx.state.userSummaries.find(u => u.userId === id);
                if (found === undefined) {
                    const payload = { content: `User summary not found for id ${id}`, klass: "error" };
                    await ctx.dispatch("setSnackbar", payload, { root: true });
                    return;
                }
                ctx.commit(mutations.SELECT_USER, found);
                ctx.commit(mutations.SET_LOADING_USER, true);
                let user = ctx.state.users.find(u => u.id === id);
                if (user == null) {
                    user = await userRepo.fetchUser(id);
                }
                ctx.commit(mutations.SET_USER, user);
            }
            catch (err) {
                await ctx.dispatch("setSnackbar", { content: err.message, klass: "error" }, { root: true });
            }
            finally {
                ctx.commit(mutations.SET_LOADING_USER, false);
            }
        }
    }
};
//# sourceMappingURL=users.js.map