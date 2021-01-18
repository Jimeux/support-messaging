<template>
  <div @scroll="onScroll"
       class="message-list pa-4"
       :style="`overflow-y: auto; height: ` + height + `px;`">

    <div style="text-align: center;">
      <v-progress-circular v-if="loadingPage" style="text-align: center;"
                           :size="messages.length === 0 ? 50 : 25"
                           :width="messages.length === 0 ? 5 : 2"
                           indeterminate
                           ref="loader"
                           :style="`margin-top: ${loadingMargin}px; margin-bottom: 25px;`"
      ></v-progress-circular>
    </div>

    <div v-if="currentUser">
      <MessageBubble v-for="m in convertedMessages" ref="bubbles" :user="currentUser" :message="m" :key="m.id"/>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import Message, {Messages, MessageView} from "@/data/message"
import MessageBubble from "@/components/messages/MessageBubble.vue"
import {User} from "@/data/user";

@Component({
  components: {MessageBubble}
})
export default class MessageList extends Vue {
  @Prop({required: true})
  readonly messages!: Array<Message>
  @Prop({required: true})
  readonly onScrollToTop!: () => void
  @Prop({required: true})
  readonly loadingPage!: boolean
  @Prop({required: true})
  readonly currentUser!: User

  height = 500

  mounted() {
    this.$nextTick(() => this.setHeight())
    window.addEventListener('resize', this.setHeight.bind(this))
  }

  @Watch('messages')
  onMessagesUpdated(newVal: Array<Message>) {
    if (this.currentMessageId == null) {
      this.$nextTick(() => this.setHeight())
    } else {
      const messageId = this.currentMessageId
      this.$nextTick(() => this.scrollToMessage(messageId))
    }
  }

  get currentMessageId(): number | null {
    const pg = this.$store.getters["messages/pagingState"]
    return pg ? pg.currentMessageId : null;
  }

  get loadingMargin(): number {
    return this.messages.length === 0 ? this.height / 2 - 50 : 20
  }

  get convertedMessages(): Array<MessageView> {
    // FIXME store getter
    return Messages.toMessageViews(this.messages)
  }

  scrollToMessage(messageId: number) {
    const bubbles = (this.$refs["bubbles"] as Array<Vue>)
    if (!bubbles) return

    for (const b of bubbles) {
      const el = (b.$el as HTMLElement)
      if (parseInt(el.id, 10) === messageId) {
        this.$el.scrollTop = el.offsetTop - 64 - 64
        break
      }
    }
  }

  onScroll() {
    if (!this.loadingPage && this.$el.scrollTop === 0 && this.messages.length !== 0) {
      this.onScrollToTop()
    }
  }

  setHeight() {
    const appBarHeight = this.getHeightByClass('v-app-bar')
    const footerHeight = this.getHeightByClass('v-footer')
    const toolbarHeight = 64
    this.height = window.innerHeight - appBarHeight - footerHeight - toolbarHeight

    if (this.$el.lastElementChild) {
      this.$el.scrollTop = (this.$el.lastElementChild as HTMLElement).offsetTop
    }
  }

  getHeightByClass(className: string): number {
    const elements = document.getElementsByClassName(className)
    return elements.length === 0 ? 0 : (elements[0] as HTMLElement).offsetHeight
  }
}
</script>
