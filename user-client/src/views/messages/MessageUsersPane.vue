<template>
  <MessageOnlineUserList :userSummaries="users.userSummaries"
                         :onSummarySelected="onSummarySelected"
                         :activeSummary="users.activeUserSummary"/>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {mapActions, mapState} from "vuex";
import MessageOnlineUserList from "@/components/messages/MessageOnlineUserList.vue";
import {UserNamespace, UserState} from "@/store/modules/users";
import {MessageNamespace} from "@/store/modules/messages";

@Component({
  components: {
    MessageOnlineUserList
  },
  computed: {...mapState([UserNamespace])},
  methods: {
    ...mapActions(UserNamespace, ['selectUser', 'fetchUserSummaries']),
    ...mapActions(MessageNamespace, ['fetchMessages'])
  }
})
export default class MessageUsersPane extends Vue {
  users!: UserState;
  selectUser!: (id: number) => void
  fetchMessages!: (id: number) => void
  fetchUserSummaries!: () => void

  created() {
    this.fetchUserSummaries();
  }

  onSummarySelected(userId: number) {
    this.selectUser(userId);
    this.fetchMessages(userId);
  }
}
</script>
