<template>
  <v-toolbar flat v-if="users.activeUserSummary" style="background: transparent;">
    <v-list-item-avatar size="28px">
      <v-img :src="users.activeUserSummary.avatar"></v-img>
    </v-list-item-avatar>
    <v-toolbar-title style="font-size: 110%;">
      {{users.activeUserSummary.name}}
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
import {mapState} from "vuex";
import {UserNamespace, UserState} from "@/store/modules/users";

@Component({
  components: {},
  computed: {...mapState([UserNamespace])},
})
export default class MessageToolbarPane extends Vue {
  users!: UserState;
}
</script>
