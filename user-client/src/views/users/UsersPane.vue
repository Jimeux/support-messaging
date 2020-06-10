<template>
  <div>
    <v-toolbar flat style="background: transparent; border-right: 1px solid rgba(255, 255, 255, 0.12);">
      <v-list-item-avatar size="40px" class="ml-2">
        <v-img src="http://placekitten.com/220/220"></v-img>
      </v-list-item-avatar>
      <v-toolbar-title >
        Concierge Messenger
      </v-toolbar-title>
    </v-toolbar>

    <div
        :style="`overflow-y: auto; height: ` + height + `px; background: transparent; border-top: 1px solid rgba(255, 255, 255, 0.12); border-right: 1px solid rgba(255, 255, 255, 0.12);`">

      <div v-if="users.loadingSummaries" style="text-align: center;">
        <v-progress-circular :size="50"
                             :width="5"
                             indeterminate
                             :style="`margin-top: ${height / 2 - 50}px;`"
        ></v-progress-circular>
      </div>

      <UserList :userSummaries="users.userSummaries"
                :onSummarySelected="onSummarySelected"
                :activeSummary="users.activeUserSummary"/>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {mapActions, mapState} from "vuex";
import UserList from "@/components/users/UserList.vue";
import {UserNamespace, UserState} from "@/store/modules/users";
import {MessageNamespace} from "@/store/modules/messages";

@Component({
  components: {
    UserList
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

  height = 500;

  created() {
    this.fetchUserSummaries();
  }

  onSummarySelected(userId: number) {
    this.selectUser(userId);
    this.fetchMessages(userId);
  }

  mounted() {
    this.setHeight();
    // todo avoid multiple
    window.addEventListener('resize', this.setHeight.bind(this));
  }

  setHeight() {
    const appBarHeight = this.getHeightByClass('v-app-bar');
    this.height = window.innerHeight - appBarHeight - 64;
  }

  getHeightByClass(className: string): number {
    const elements = document.getElementsByClassName(className)
    return elements.length === 0 ? 0 : (elements[0] as HTMLElement).offsetHeight;
  }
}
</script>
