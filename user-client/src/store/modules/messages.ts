import {ActionContext, Module} from "vuex"
import {RootState} from "@/store/store"
import Message from "@/data/message"
import MessageRepository from "@/api/messageRepository"

// todo how to inject?
const msgRepo = new MessageRepository()

export interface PagingState {
  userId: number;
  currentPage: number;
  hasMore: boolean;
  currentMessageId: number | null; // TODO
}

export interface MessageState {
  currentUserId: number | null;
  loadingPage: boolean;
  messages: Array<Message>;
  pagingStates: Array<PagingState>;
}

enum mutations {
  ADD_MESSAGE = 'ADD_MESSAGE',
  ADD_MESSAGES = 'ADD_MESSAGES',
  SAVE_MESSAGE_POSITION = 'SAVE_MESSAGE_POSITION',
  SET_LOADING_PAGE = 'SET_LOADING_PAGE',
  SET_CURRENT_USER = 'SET_CURRENT_USER'
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
    pagingStates: [],
    currentUserId: null,
    loadingPage: false
  },

  getters: {
    currentMessages: (state) => state.messages
        .filter(m => m.userId == state.currentUserId)
        .sort((a, b) => (a.sentAt >= b.sentAt) ? 1 : -1),
    pagingState: (state) => state.pagingStates.find(m => m.userId == state.currentUserId)
  },

  mutations: {
    [mutations.SET_CURRENT_USER](state: MessageState, userId: number) {
      state.currentUserId = userId
    },

    [mutations.ADD_MESSAGE](state: MessageState, msg: Message) {
      state.messages = [...state.messages, msg]
    },

    [mutations.ADD_MESSAGES](state: MessageState, messages: Array<Message>) {
      const pg = state.pagingStates.find(s => s.userId === state.currentUserId)

      const currentMessageId = messages[0].id
      const hasMore = messages.length == 20

      if (pg == null) {
        state.pagingStates.push({
          userId: state.currentUserId!,
          currentMessageId: currentMessageId,
          currentPage: 2, // first page already loaded
          hasMore: hasMore
        })
      } else {
        Object.assign(pg, {
          currentMessageId: currentMessageId,
          currentPage: pg.currentPage += 1,
          hasMore: hasMore
        })
      }

      state.messages = [...messages, ...state.messages]
    },

    [mutations.SAVE_MESSAGE_POSITION](state: MessageState, messageId: number) {
      const index = state.pagingStates.findIndex(s => s.userId === state.currentUserId)
      const pg = state.pagingStates[index]
      if (pg) {
        pg.currentMessageId = messageId
        state.pagingStates.splice(index, 1, pg)
      }
    },

    [mutations.SET_LOADING_PAGE](state: MessageState, loading: boolean) {
      state.loadingPage = loading
    }
  },

  actions: {
    [MessageActions.addMessage](ctx: ActionContext<MessageState, RootState>, {msg}) {
      ctx.commit(mutations.ADD_MESSAGE, msg)
    },

    async [MessageActions.sendMessage](ctx: ActionContext<MessageState, RootState>, {userId, text}) {
      try {
        const msg = await msgRepo.create(userId, text)
        ctx.commit(mutations.ADD_MESSAGE, msg)
      } catch (err) {
        console.log(err)
      } /*finally {
      }*/
    },

    [MessageActions.updateLastReadTime]() {
      console.log("updateLastReadTime")
    },

    async [MessageActions.fetchMessages](ctx: ActionContext<MessageState, RootState>, id: number) {
      try {
        ctx.commit(mutations.SET_CURRENT_USER, id)
        ctx.commit(mutations.SET_LOADING_PAGE, true)

        const pg = ctx.state.pagingStates.find(s => s.userId === id)
        if (pg != null) {
          return
        }

        const messages = await msgRepo.fetchMessages(id, 1)
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

      const pg = ctx.state.pagingStates.find(s => s.userId === userId)
      const currentPage = pg == null ? 1 : pg.currentPage

      ctx.commit(mutations.SET_LOADING_PAGE, true)
      if (ctx.getters.currentMessages.length !== 0) {
        ctx.commit(mutations.SAVE_MESSAGE_POSITION, ctx.getters.currentMessages[0].id)
      }

      try {
        const messages = await msgRepo.fetchMessages(userId, currentPage)
        ctx.commit(mutations.ADD_MESSAGES, messages)
      } catch (err) {
        await ctx.dispatch("setSnackbar", {content: err.message, klass: "error"}, {root: true})
      } finally {
        ctx.commit(mutations.SET_LOADING_PAGE, false)
      }
    }

  }
}
