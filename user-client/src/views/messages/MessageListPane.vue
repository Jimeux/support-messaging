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
import {MessageState, MessageNamespace} from "@/store/modules/messages";
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
    ...mapActions(MessageNamespace, ["sendMessage", "updateLastReadTime", "nextPage"])
  }
})
export default class MessageListPane extends Vue {
  // state
  messages!: MessageState;
  users!: UserState;
  // actions
  sendMessage!: (obj: object) => void;
  updateLastReadTime!: () => void;
  nextPage!: (userId: number) => void;

  onScrollToTop() {
    if (this.users.activeUser == null || !this.messages.hasMore) {
      return;
    }

    this.nextPage(this.users.activeUser?.id);
  }

  onSendMessage(text: string) {
    if (this.users.activeUser == null) {
      return;
    }
    this.sendMessage({userId: this.users.activeUser.id, text: text})
  }
}
</script>
