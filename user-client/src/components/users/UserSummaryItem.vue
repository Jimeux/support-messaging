<template>
  <v-list-item class="pl-7">
    <template v-slot:default="{}">

      <v-badge avatar overlap bottom right color="green darken-1" class="online-badge mr-3">
        <v-avatar size="50">
          <v-img :src="summary.avatar"></v-img>
        </v-avatar>
      </v-badge>

      <v-list-item-content>
        <v-list-item-title :class="summary.unreadCount > 0 ? 'font-weight-medium' : ''"
                           v-text="summary.name"></v-list-item-title>
        <v-list-item-subtitle class="text--primary"
                              v-text="displayDate(summary.lastSendTime)"></v-list-item-subtitle>
        <v-list-item-subtitle v-text="summary.lastMessagePreview"></v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-action>
        <!--<v-list-item-action-text v-text="summary.displayDate()"></v-list-item-action-text>-->
        <!--<v-icon v-if="!active" color="grey lighten-1">star_border</v-icon>
        <v-icon v-else color="yellow">star</v-icon>-->

        <v-badge v-if="summary.unreadCount > 0"
                 dot
                 color="red"></v-badge>
      </v-list-item-action>
    </template>
  </v-list-item>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import {UserSummary} from "@/data/user"
import UserSearchBox from "@/components/users/UserSearchBox.vue"
import dayjs from "dayjs"

@Component({
  components: {UserSearchBox}
})
export default class UserSummaryItem extends Vue {
  @Prop({required: true})
  readonly summary!: UserSummary

  displayDate(lastSendTime: string): string {
    if (lastSendTime == null) {
      return ""
    }

    const sendTime = dayjs(lastSendTime)
    const twoDaysAgo = dayjs().add(-1, "day")
    if (sendTime.isBefore(twoDaysAgo)) {
      return sendTime.format("MM/DD HH:mm")
    }
    return dayjs(lastSendTime).fromNow()
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
