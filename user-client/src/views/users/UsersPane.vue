<template>
  <div>
    <v-toolbar flat style="background: transparent; border-right: 1px solid rgba(255, 255, 255, 0.12);">
      <v-list-item-avatar size="40px" class="ml-2">
        <v-img src="https://placekitten.com/220/220"></v-img>
      </v-list-item-avatar>
      <v-toolbar-title>
        Support Messenger
      </v-toolbar-title>
    </v-toolbar>

    <div
        :style="`overflow-y: auto; height: ` + height + `px; background: transparent; border-top: 1px solid rgba(255, 255, 255, 0.12); border-right: 1px solid rgba(255, 255, 255, 0.12);`">

      <UserSearchBox class="mx-4 mt-4 mb-2" v-if="users.userSummaries.length !== 0" :onSearch="search"/>

      <v-tabs fixed-tabs background-color="transparent ma-0">
        <v-tab>All</v-tab>
        <v-tab>Mine</v-tab>
      </v-tabs>

      <div v-if="users.loadingSummaries" style="text-align: center;">
        <v-progress-circular :size="50"
                             :width="5"
                             indeterminate
                             :style="`margin-top: ${height / 2 - 50}px;`"
        ></v-progress-circular>
      </div>

      <UserSummaryList v-if="!users.loadingSummaries"
                       :userSummaries="users.userSummaries"
                       :onSummarySelected="onSummarySelected"
                       :activeSummary="users.activeUserSummary"/>

    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import {mapActions, mapState} from "vuex"
import UserSummaryList from "@/components/users/UserSummaryList.vue"
import {UserActions, UserNamespace, UserState} from "@/store/modules/users"
import {MessageActions, MessageNamespace} from "@/store/modules/messages"
import UserSearchBox from "@/components/users/UserSearchBox.vue";

@Component({
  components: {
    UserSearchBox,
    UserSummaryList
  },
  computed: {...mapState([UserNamespace])},
  methods: {
    ...mapActions(UserNamespace, [UserActions.search, UserActions.selectUser, UserActions.fetchUserSummaries]),
    ...mapActions(MessageNamespace, [MessageActions.fetchMessages])
  }
})
export default class MessageUsersPane extends Vue {
  // actions
  readonly fetchMessages!: (id: number) => void
  readonly selectUser!: (id: number) => void
  readonly search!: (id: number) => void
  readonly fetchUserSummaries!: () => void
  // state
  readonly users!: UserState
  // data
  height = 500

  created() {
    this.fetchUserSummaries()
  }

  onSummarySelected(userId: number) {
    if (this.users.activeUser?.id !== userId) {
      this.$router.push(`/m/${userId}`)
      this.selectUser(userId)
      this.fetchMessages(userId)
    }
  }

  mounted() {
    this.setHeight()
    // todo avoid multiple
    window.addEventListener('resize', this.setHeight.bind(this))
  }

  setHeight() {
    const appBarHeight = this.getHeightByClass('v-app-bar')
    this.height = window.innerHeight - appBarHeight - 64
  }

  getHeightByClass(className: string): number {
    const elements = document.getElementsByClassName(className)
    return elements.length === 0 ? 0 : (elements[0] as HTMLElement).offsetHeight
  }
}
</script>
