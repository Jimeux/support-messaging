<template>
  <v-container fluid class="pa-0 home">
    <v-row no-gutters>
      <v-col cols="3" class="pa-0" style="border-right: 1px solid rgba(255, 255, 255, 0.12)">
        <MessageUsersPane/>
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
            <MessageUserInfoPane/>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {Component} from "vue-property-decorator";
import MessagePane from '@/views/messages/MessageListPane.vue'
import MessageUsersPane from "@/views/messages/MessageUsersPane.vue";
import MessageUserInfoPane from "@/views/messages/MessageUserInfoPane.vue";
import MessageToolbarPane from "@/views/messages/MessageToolbarPane.vue";

@Component({
  components: {
    MessageToolbarPane,
    MessageUserInfoPane,
    MessageUsersPane,
    MessagePane
  }
})
export default class MessagesLayout extends Vue {
}
</script>
