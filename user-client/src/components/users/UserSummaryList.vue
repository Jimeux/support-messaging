<template>
  <v-list two-line style="background: transparent;" class="pt-0">
    <v-list-item-group :value="selectedIndex" active-class="primary--text">
      <UserSummaryItem v-for="(s, index) in userSummaries"
                       :summary="s"
                       :key="s.userId"
                       @click.native="summarySelected(s.userId, index)"/>
    </v-list-item-group>
  </v-list>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import {UserSummary} from "@/data/user"
import UserSearchBox from "@/components/users/UserSearchBox.vue"
import UserSummaryItem from "@/components/users/UserSummaryItem.vue"

@Component({
  components: {UserSummaryItem, UserSearchBox}
})
export default class UserSummaryList extends Vue {
  @Prop({required: true})
  readonly activeSummary!: UserSummary | null
  @Prop({required: true})
  readonly userSummaries!: Array<UserSummary>
  @Prop({required: true})
  readonly onSummarySelected!: (id: number) => void

  selectedIndex = -1

  created() {
    this.setActiveIndex()
  }

  updated() {
    this.setActiveIndex()
  }

  setActiveIndex() {
    if (this.activeSummary != null)
      this.selectedIndex = this.userSummaries.findIndex(s => s.userId === this.activeSummary?.userId)
  }

  summarySelected(summaryId: number, index: number) {
    this.selectedIndex = index
    this.onSummarySelected(summaryId)
  }
}
</script>

<style>
.online-badge span.v-badge__badge {
  height: 12px !important;
  width: 12px;
  min-width: 12px !important;
}
</style>
