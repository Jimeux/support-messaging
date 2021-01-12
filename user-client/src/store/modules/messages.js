import Message from "@/data/message";
import MessageRepository from "@/api/messageRepository";
// todo how to inject?
const msgRepo = new MessageRepository();
var mutations;
(function (mutations) {
    mutations["ADD_MESSAGE"] = "ADD_MESSAGE";
    mutations["ADD_MESSAGES"] = "ADD_MESSAGES";
    mutations["SAVE_MESSAGE_POSITION"] = "SAVE_MESSAGE_POSITION";
    mutations["SET_LOADING_PAGE"] = "SET_LOADING_PAGE";
    mutations["SET_CURRENT_USER"] = "SET_CURRENT_USER";
})(mutations || (mutations = {}));
export var MessageActions;
(function (MessageActions) {
    MessageActions["addMessage"] = "addMessage";
    MessageActions["sendMessage"] = "sendMessage";
    MessageActions["updateLastReadTime"] = "updateLastReadTime";
    MessageActions["fetchMessages"] = "fetchMessages";
    MessageActions["nextPage"] = "nextPage";
})(MessageActions || (MessageActions = {}));
export const MessageNamespace = "messages";
export const messages = {
    namespaced: true,
    state: {
        messages: [],
        pagingStates: [],
        currentUserId: null,
        loadingPage: false
    },
    getters: {
        currentMessages: (state) => state.messages.filter(m => m.userId == state.currentUserId),
        pagingState: (state) => state.pagingStates.find(m => m.userId == state.currentUserId)
    },
    mutations: {
        [mutations.SET_CURRENT_USER](state, userId) {
            state.currentUserId = userId;
        },
        [mutations.ADD_MESSAGE](state, msg) {
            state.messages = [...state.messages, msg].sort((a, b) => (a.id >= b.id) ? 1 : -1);
        },
        [mutations.ADD_MESSAGES](state, messages) {
            state.messages = [...messages, ...state.messages]
                .sort((a, b) => (a.sentAt >= b.sentAt) ? 1 : -1); // TODO better sorting?
            const pg = state.pagingStates.find(s => s.userId === state.currentUserId);
            const currentMessageId = messages[0].id;
            const hasMore = messages.length == 20;
            if (pg == null) {
                state.pagingStates.push({
                    userId: state.currentUserId,
                    currentMessageId: currentMessageId,
                    currentPage: 2,
                    hasMore: hasMore
                });
            }
            else {
                Object.assign(pg, {
                    currentMessageId: currentMessageId,
                    currentPage: pg.currentPage += 1,
                    hasMore: hasMore
                });
            }
        },
        [mutations.SAVE_MESSAGE_POSITION](state, messageId) {
            const index = state.pagingStates.findIndex(s => s.userId === state.currentUserId);
            const pg = state.pagingStates[index];
            if (pg) {
                pg.currentMessageId = messageId;
                state.pagingStates.splice(index, 1, pg);
            }
        },
        [mutations.SET_LOADING_PAGE](state, loading) {
            state.loadingPage = loading;
        }
    },
    actions: {
        [MessageActions.addMessage](ctx, { msg }) {
            ctx.commit(mutations.ADD_MESSAGE, msg);
        },
        [MessageActions.sendMessage](ctx, { userId, text }) {
            const msg = new Message({
                id: 100,
                user_id: userId,
                staff_id: null,
                status: 3,
                content_type: 1,
                content: text,
                sent_at: (new Date()).getMilliseconds(),
                from_user: false
            });
            ctx.commit(mutations.ADD_MESSAGE, msg);
        },
        [MessageActions.updateLastReadTime]() {
            console.log("updateLastReadTime");
        },
        async [MessageActions.fetchMessages](ctx, id) {
            try {
                ctx.commit(mutations.SET_CURRENT_USER, id);
                ctx.commit(mutations.SET_LOADING_PAGE, true);
                const pg = ctx.state.pagingStates.find(s => s.userId === id);
                if (pg != null) {
                    return;
                }
                const messages = await msgRepo.fetchMessages(id, 1);
                ctx.commit(mutations.ADD_MESSAGES, messages);
            }
            catch (err) {
                await ctx.dispatch("setSnackbar", { content: err.message, klass: "error" }, { root: true });
            }
            finally {
                ctx.commit(mutations.SET_LOADING_PAGE, false);
            }
        },
        async [MessageActions.nextPage](ctx, userId) {
            if (ctx.state.loadingPage)
                return; // in progress
            const pg = ctx.state.pagingStates.find(s => s.userId === userId);
            const currentPage = pg == null ? 1 : pg.currentPage;
            ctx.commit(mutations.SET_LOADING_PAGE, true);
            if (ctx.getters.currentMessages.length !== 0) {
                ctx.commit(mutations.SAVE_MESSAGE_POSITION, ctx.getters.currentMessages[0].id);
            }
            try {
                const messages = await msgRepo.fetchMessages(userId, currentPage);
                ctx.commit(mutations.ADD_MESSAGES, messages);
            }
            catch (err) {
                await ctx.dispatch("setSnackbar", { content: err.message, klass: "error" }, { root: true });
            }
            finally {
                ctx.commit(mutations.SET_LOADING_PAGE, false);
            }
        }
    }
};
//# sourceMappingURL=messages.js.map