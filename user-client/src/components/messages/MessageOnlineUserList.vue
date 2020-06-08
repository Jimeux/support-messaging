<template>
  <v-list two-line style="background: transparent;">
    <v-list-item-group v-model="selectedIndex" active-class="primary--text">
      <template v-for="(item, index) in userSummaries">
        <v-list-item :key="item.userId" class="pl-7" @click="onUserSelected(item.userId)" >

          <template v-slot:default="{}">

            <v-badge avatar overlap bottom right color="green darken-1" class="online-badge mr-3">
              <v-avatar size="50">
                <v-img :src="item.avatar"></v-img>
              </v-avatar>
            </v-badge>

            <v-list-item-content>
              <v-list-item-title :class="item.unreadCount > 0 ? 'font-weight-medium' : ''"
                                 v-text="item.name"></v-list-item-title>
              <v-list-item-subtitle class="text--primary"
                                    v-text="displayDate(item.lastSendTime)"></v-list-item-subtitle>
              <v-list-item-subtitle v-text="item.lastMessagePreview"></v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <!--<v-list-item-action-text v-text="item.displayDate()"></v-list-item-action-text>-->
              <!--<v-icon v-if="!active" color="grey lighten-1">star_border</v-icon>
              <v-icon v-else color="yellow">star</v-icon>-->

              <v-badge v-if="item.unreadCount > 0"
                       dot
                       color="red"></v-badge>
            </v-list-item-action>
          </template>
        </v-list-item>

        <v-divider v-if="index + 1 < userSummaries.length" :key="'in-' + index"></v-divider>
      </template>
    </v-list-item-group>
  </v-list>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {UserSummary} from "@/data/user";

@Component
export default class MessageOnlineUserList extends Vue {
  @Prop({required: true})
  activeSummary!: UserSummary | null;
  @Prop({required: true})
  userSummaries!: Array<UserSummary>;
  @Prop({required: true})
  onUserSelected!: (id: number) => void;

  selectedIndex = -1;

  created() {
    if (this.activeSummary != null)
      this.selectedIndex = this.userSummaries.findIndex(us => us.userId == this.activeSummary?.userId);
  }

  displayDate(lastSendTime: string): string {
    if (lastSendTime == null) {
      return "";
    }

    const d = new Date(lastSendTime);
    const hours = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
    const minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();

    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${hours}:${minutes}`
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
