export class UserSummary {
  readonly userId!: number
  readonly name!: string
  readonly avatar!: string
  readonly unreadCount!: number
  readonly lastMessagePreview!: string
  readonly lastSendTime!: string
}

export class User {
  readonly id!: number
  readonly name!: string
  readonly avatar!: string
  readonly location!: string
  readonly gender!: string
  readonly registrationDate!: string
  readonly profile!: string
  readonly notes!: string
}
