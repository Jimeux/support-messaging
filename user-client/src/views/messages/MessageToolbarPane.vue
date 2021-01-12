<template>
  <v-toolbar flat v-if="users.activeUserSummary" style="background: transparent;">

    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-list-item-avatar size="28px" v-bind="attrs"
                            v-on="on">
          <v-img :src="users.activeUserSummary.avatar"></v-img>
        </v-list-item-avatar>
      </template>
      <span>{{ users.activeUserSummary.displayName() }}</span>
    </v-tooltip>

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
import {Component, Vue} from 'vue-property-decorator'
import {mapState} from "vuex"
import {UserNamespace, UserState} from "@/store/modules/users"

@Component({
  components: {},
  computed: {...mapState([UserNamespace])},
})
export default class MessageToolbarPane extends Vue {
  readonly users!: UserState
}
</script>
