<template>
  <v-container class="pa-0" v-if="users.activeUserSummary">
    <MessageList :messages="messages.messages"
                 :onScrollToTop="onScrollToTop"
                 :loadingPage="messages.loadingPage"
                 :currentMessageId="messages.currentMessageId"/>
    <MessageSendBox :onSend="onSendMessage"/>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {mapActions, mapState} from "vuex";
import {MessageState, MessageNamespace, MessageActions} from "@/store/modules/messages";
import MessageSendBox from "@/components/messages/MessageSendBox.vue";
import MessageList from "@/components/messages/MessageList.vue";
import {UserNamespace, UserState} from "@/store/modules/users";

@Component({
  components: {
    MessageList,
    MessageSendBox,
  },
  computed: {
    ...mapState([MessageNamespace]),
    ...mapState([UserNamespace])
  },
  methods: {
    ...mapActions(MessageNamespace, [MessageActions.sendMessage, MessageActions.updateLastReadTime, MessageActions.nextPage])
  }
})
export default class MessageListPane extends Vue {
  // actions
  readonly sendMessage!: (obj: object) => void;
  readonly updateLastReadTime!: () => void;
  readonly nextPage!: (userId: number) => void;
  // state
  readonly messages!: MessageState;
  readonly users!: UserState;

  onScrollToTop() {
    if (this.users.activeUser != null && this.messages.hasMore) {
      this.nextPage(this.users.activeUser.id);
    }
  }

  onSendMessage(text: string) {
    if (this.users.activeUser != null) {
      this.sendMessage({userId: this.users.activeUser.id, text: text})
    }
  }
}
</script>
