<template>
  <v-container class="pa-0" v-if="messages.activeUserSummary">
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

@Component({
  components: {
    MessageList,
    MessageSendBox,
  },
  computed: {...mapState([MessageNamespace])},
  methods: {...mapActions(MessageNamespace, ["sendMessage", "updateLastReadTime", "nextPage"])}
})
export default class MessageListPane extends Vue {
  messages!: MessageState;
  sendMessage!: (obj: object) => void;
  updateLastReadTime!: () => void;
  nextPage!: (userId: number) => void;

  onScrollToTop() {
    if (this.messages.activeUser == null || !this.messages.hasMore) {
      return;
    }

    this.nextPage(this.messages.activeUser?.id);
  }

  onSendMessage(text: string) {
    if (this.messages.activeUser == null) {
      return;
    }
    this.sendMessage({userId: this.messages.activeUser.id, text: text})
  }
}
</script>
