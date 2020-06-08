<template>
  <MessageOnlineUserList :userSummaries="messages.userSummaries"
                         :onUserSelected="selectUser"
                         :activeSummary="messages.activeUserSummary"/>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {mapActions, mapState} from "vuex";
import {MessageState, MessageNamespace} from "@/store/modules/messages";
import MessageOnlineUserList from "@/components/messages/MessageOnlineUserList.vue";

@Component({
  components: {
    MessageOnlineUserList
  },
  computed: {...mapState([MessageNamespace])},
  methods: {...mapActions(MessageNamespace, ['selectUser', 'fetchUserSummaries'])}
})
export default class MessageUsersPane extends Vue {
  messages!: MessageState;
  selectUser!: (id: number) => void
  fetchUserSummaries!: () => void

  created() {
    this.fetchUserSummaries();
  }
}
</script>
