<template>
  <v-container fluid class="pa-0 home">
    <v-row no-gutters>
      <v-col cols="3" class="pa-0">
        <UsersPane/>
      </v-col>
      <v-col cols="9" class="pa-0">
        <v-row no-gutters>
          <v-col cols="12" style="border-bottom: 1px solid rgba(255, 255, 255, 0.12);">
            <MessageToolbarPane/>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="8">
            <MessagePane/>
          </v-col>
          <v-col cols="4" class="pa-0" style="border-left: 1px solid rgba(255, 255, 255, 0.12)">
            <UserInfoPane/>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Prop} from "vue-property-decorator";
import MessagePane from '@/views/messages/MessageListPane.vue'
import UsersPane from "@/views/users/UsersPane.vue";
import UserInfoPane from "@/views/users/UserInfoPane.vue";
import MessageToolbarPane from "@/views/messages/MessageToolbarPane.vue";
import {mapActions} from "vuex";
import {UserActions, UserNamespace} from "@/store/modules/users";
import {MessageActions, MessageNamespace} from "@/store/modules/messages";

@Component({
  components: {
    MessagePane,
    MessageToolbarPane,
    UserInfoPane,
    UsersPane
  },
  methods: {
    ...mapActions(UserNamespace, [UserActions.setActiveUserId]),
    ...mapActions(MessageNamespace, [MessageActions.fetchMessages])
  }
})
export default class MessagesLayout extends Vue {
  // actions
  readonly setActiveUserId!: (id: number) => void
  readonly fetchMessages!: (id: number) => void

  @Prop({required: true})
  readonly userId!: number | null

  mounted() {
    if (this.userId != null) {
      this.setActiveUserId(this.userId);
      this.fetchMessages(this.userId);
    }
  }
}
</script>
