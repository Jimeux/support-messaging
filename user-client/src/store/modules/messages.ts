import {Module} from "vuex";
import {RootState} from "@/store/store";
import Message from "@/data/message";
import MessageRepository from "@/api/messageRepository";

// todo how to inject?
const msgRepo = new MessageRepository();

export const MessageNamespace = "messages";

export interface MessageState {
  messages: Array<Message>;
  currentPage: number;
  hasMore: boolean;
  currentMessageId: number | null;
  loadingPage: boolean;
}

enum mutations {
  ADD_MESSAGE = 'ADD_MESSAGE',
  ADD_MESSAGES = 'ADD_MESSAGES',
  SAVE_MESSAGE_POSITION = 'SAVE_MESSAGE_POSITION',
  SET_LOADING_PAGE = 'SET_LOADING_PAGE',
  CLEAR_MESSAGES = 'CLEAR_MESSAGES'
}

const messageModule: Module<MessageState, RootState> = {
  namespaced: true,

  state: {
    messages: [],
    currentPage: 1,
    currentMessageId: null,
    loadingPage: false,
    hasMore: true
  },

  getters: {},

  mutations: {
    [mutations.CLEAR_MESSAGES](state: MessageState) {
      // todo initialState?
      state.messages = [];
      state.currentPage = 1;
      state.currentMessageId = null;
      state.loadingPage = false;
      state.hasMore = true;
    },
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
    [mutations.SAVE_MESSAGE_POSITION](state: MessageState, messageId: number) {
      state.currentMessageId = messageId;
    },
    [mutations.SET_LOADING_PAGE](state: MessageState, loading: boolean) {
      state.loadingPage = loading;
    }
  },

  actions: {
    addMessage({commit}, msg: Message) {
      commit(mutations.ADD_MESSAGE, msg);
    },
    sendMessage({commit}, {userId, text}) {
      commit(mutations.ADD_MESSAGE, new Message(100, userId, false, text, "", new Date().toJSON()));
    },
    updateLastReadTime() {
      console.log("updateLastReadTime");
    },
    async fetchMessages({commit, state, dispatch}, id: number) {
      try {
        commit(mutations.CLEAR_MESSAGES);
        const messages = await msgRepo.fetchMessages(id, state.currentPage);
        commit(mutations.ADD_MESSAGES, messages);
      } catch (err) {
        dispatch("setSnackbar", {content: err.message, klass: "error"}, {root: true})
      }
    },
    async nextPage({commit, dispatch, state}, userId: number) {
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
        dispatch("setSnackbar", {content: err.message, klass: "error"}, {root: true});
      } finally {
        commit(mutations.SET_LOADING_PAGE, false);
      }
    }
  }
};

export default messageModule;
