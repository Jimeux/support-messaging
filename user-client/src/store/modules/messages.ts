import {Module} from "vuex";
import {RootState} from "@/store/store";
import Message from "@/data/message";
import {User, UserSummary} from "@/data/user";
import MessageRepository from "@/api/messageRepository";

// todo how to inject?
const msgRepo = new MessageRepository();

export const MessageNamespace = "messages";

export interface MessageState {
  messages: Array<Message>;
  userSummaries: Array<UserSummary>;
  activeUserSummary: UserSummary | null;
  activeUser: User | null;
  currentPage: number;
  hasMore: boolean;
  currentMessageId: number | null;
  loadingPage: boolean;
}

enum mutations {
  ADD_MESSAGE = 'ADD_MESSAGE',
  ADD_MESSAGES = 'ADD_MESSAGES',

  SAVE_MESSAGE_POSITION = 'SAVE_MESSAGE_POSITION',

  SELECT_USER = 'SELECT_USER',
  ADD_USER_SUMMARIES = 'ADD_USER_SUMMARIES',
  SET_USER = 'SET_USER',
  SET_LOADING_PAGE = 'SET_LOADING_PAGE'
}

const messageModule: Module<MessageState, RootState> = {
  namespaced: true,

  state: {
    activeUserSummary: null,
    activeUser: null,
    userSummaries: [],
    messages: [],
    currentPage: 1,
    currentMessageId: null,
    loadingPage: false,
    hasMore: true
  },

  getters: {},

  mutations: {
    [mutations.ADD_MESSAGE](state: MessageState, msg: Message) {
      state.messages = [...state.messages, msg].sort((a, b) => (a.id >= b.id) ? 1 : -1);
    },
    [mutations.ADD_MESSAGES](state: MessageState, messages: Array<Message>) {
      state.messages = [...messages, ...state.messages]
          .sort((a, b) => (a.id >= b.id) ? 1 : -1);
      state.currentPage += 1;
      if (messages.length < 20) //todo limit const
        state.hasMore = false;
    },
    [mutations.SELECT_USER](state: MessageState, us: UserSummary) {
      state.activeUserSummary = us;

      // init
      state.hasMore = true;
      state.currentPage = 1;
      state.messages = [];
      state.currentMessageId = null;
      state.activeUser = null;
    },
    [mutations.SET_USER](state: MessageState, user: User) {
      state.activeUser = user;
    },
    [mutations.SAVE_MESSAGE_POSITION](state: MessageState, messageId: number) {
      state.currentMessageId = messageId;
    },
    [mutations.ADD_USER_SUMMARIES](state: MessageState, us: Array<UserSummary>) {
      state.userSummaries = us;
    },
    [mutations.SET_LOADING_PAGE](state: MessageState, loading: boolean) {
      state.loadingPage = loading;
    }
  },

  actions: {
    async fetchUserSummaries({commit}) {
      // todo try/catch
      const us = await msgRepo.fetchUserSummaries();
      commit(mutations.ADD_USER_SUMMARIES, us);
    },
    addMessage({commit}, msg: Message) {
      commit(mutations.ADD_MESSAGE, msg);
    },
    sendMessage({commit}, {userId, text}) {
      commit(mutations.ADD_MESSAGE, new Message(100, userId, false, text, "", new Date().toJSON()));
    },
    updateLastReadTime() {
      console.log("updateLastReadTime");
    },
    async selectUser({commit, state}, id: number) {
      const found = state.userSummaries.find(u => u.userId === id)
      if (found === undefined) {
        return;
        // todo snackbar error
      }

      commit(mutations.SELECT_USER, found);
      try {
        const messages = await msgRepo.fetchMessages(id, state.currentPage);
        commit(mutations.ADD_MESSAGES, messages);

        const user = await msgRepo.fetchUser(id);
        commit(mutations.SET_USER, user);
      } catch (err) {
        // todo snackbar error
        console.log(err);
      }
    },
    async nextPage({commit, state}, userId: number) {
      if (state.loadingPage)
        return; // in progress

      commit(mutations.SET_LOADING_PAGE, true);
      if (state.messages.length !== 0) {
        commit(mutations.SAVE_MESSAGE_POSITION, state.messages[0].id); // todo check length
      }

      try {
        const messages = await msgRepo.fetchMessages(userId, state.currentPage);
        commit(mutations.ADD_MESSAGES, messages);
      } catch (err) {
        console.log(err); // todo snackbar error
      } finally {
        commit(mutations.SET_LOADING_PAGE, false);
      }
    }
  }
};

export default messageModule;
