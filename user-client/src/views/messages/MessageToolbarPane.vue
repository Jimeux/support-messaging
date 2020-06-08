<template>
  <v-toolbar flat v-if="messages.activeUserSummary" style="background: transparent;">
    <v-list-item-avatar size="30px">
      <v-img :src="messages.activeUserSummary.avatar"></v-img>
    </v-list-item-avatar>
    <v-toolbar-title style="font-size: 110%;">
      {{messages.activeUserSummary.name}}
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>support_agent</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>markunread</v-icon>
    </v-btn>
    <v-btn icon class="mr-1">
      <v-icon>more_vert</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {mapActions, mapState} from "vuex";
import {MessageState, MessageNamespace} from "@/store/modules/messages";

@Component({
  components: {},
  computed: {...mapState([MessageNamespace])},
  methods: {...mapActions(MessageNamespace, [])}
})
export default class MessageToolbarPane extends Vue {
  messages!: MessageState;
}
</script>
