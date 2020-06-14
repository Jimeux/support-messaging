import {ActionContext, Module} from "vuex"
import {RootState} from "@/store/store"
import Message from "@/data/message"
import MessageRepository from "@/api/messageRepository"

// todo how to inject?
const msgRepo = new MessageRepository()

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

export enum MessageActions {
  addMessage = 'addMessage',
  sendMessage = 'sendMessage',
  updateLastReadTime = 'updateLastReadTime',
  fetchMessages = 'fetchMessages',
  nextPage = 'nextPage'
}

export const MessageNamespace = "messages"

export const messages: Module<MessageState, RootState> = {
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
      state.messages = []
      state.currentPage = 1
      state.currentMessageId = null
      state.loadingPage = false
      state.hasMore = true
    },

    [mutations.ADD_MESSAGE](state: MessageState, msg: Message) {
      state.messages = [...state.messages, msg].sort((a, b) => (a.id >= b.id) ? 1 : -1)
    },

    [mutations.ADD_MESSAGES](state: MessageState, messages: Array<Message>) {
      state.messages = [...messages, ...state.messages]
          .sort((a, b) => (a.id >= b.id) ? 1 : -1)
      state.currentPage += 1
      if (messages.length < 20) //todo limit const
        state.hasMore = false
    },

    [mutations.SAVE_MESSAGE_POSITION](state: MessageState, messageId: number) {
      state.currentMessageId = messageId
    },

    [mutations.SET_LOADING_PAGE](state: MessageState, loading: boolean) {
      state.loadingPage = loading
    }
  },

  actions: {
    [MessageActions.addMessage](ctx: ActionContext<MessageState, RootState>, {msg}) {
      ctx.commit(mutations.ADD_MESSAGE, msg)
    },

    [MessageActions.sendMessage](ctx: ActionContext<MessageState, RootState>, { userId, text }) {
      const msg = new Message(100, userId, false, text, "", new Date().toJSON())
      ctx.commit(mutations.ADD_MESSAGE, msg)
    },

    [MessageActions.updateLastReadTime]() {
      console.log("updateLastReadTime")
    },

    async [MessageActions.fetchMessages](ctx: ActionContext<MessageState, RootState>, id: number) {
      try {
        ctx.commit(mutations.CLEAR_MESSAGES)
        ctx.commit(mutations.SET_LOADING_PAGE, true)

        const messages = await msgRepo.fetchMessages(id, ctx.state.currentPage)
        ctx.commit(mutations.ADD_MESSAGES, messages)
      } catch (err) {
        await ctx.dispatch("setSnackbar", {content: err.message, klass: "error"}, {root: true})
      } finally {
        ctx.commit(mutations.SET_LOADING_PAGE, false)
      }
    },

    async [MessageActions.nextPage](ctx: ActionContext<MessageState, RootState>, userId: number) {
      if (ctx.state.loadingPage)
        return // in progress

      ctx.commit(mutations.SET_LOADING_PAGE, true)
      if (ctx.state.messages.length !== 0) {
        ctx.commit(mutations.SAVE_MESSAGE_POSITION, ctx.state.messages[0].id) // todo check length
      }

      try {
        const messages = await msgRepo.fetchMessages(userId, ctx.state.currentPage)
        ctx.commit(mutations.ADD_MESSAGES, messages)
      } catch (err) {
        await ctx.dispatch("setSnackbar", {content: err.message, klass: "error"}, {root: true})
      } finally {
        ctx.commit(mutations.SET_LOADING_PAGE, false)
      }
    }

  }
}
