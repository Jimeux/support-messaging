export class UserSummary {
  readonly userId!: number
  readonly firstName!: string
  readonly lastName!: string
  readonly avatar!: string
  readonly lastSent!: number
  readonly unreadCount!: number
  readonly preview!: string

  constructor(data: any) {
    this.userId = data.user_id;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.avatar = data.avatar;
    this.lastSent = data.last_sent;
    this.unreadCount = data.unread_count;
    this.preview = data.preview;
  }

  displayName(): string {
    return this.firstName + " " + this.lastName;
  }
}

export class User {
  readonly id!: number
  readonly firstName!: string
  readonly lastName!: string
  readonly avatar!: string
  readonly location!: string
  readonly gender!: string
  readonly registrationDate!: string
  readonly profile!: string
  readonly notes!: string


  constructor(data: any) {
    this.id = data.id
    this.firstName = data.first_name
    this.lastName = data.last_name
    this.avatar = data.avatar
    this.location = "Tokyo"
    this.gender = "M"
    this.registrationDate = ""
    this.profile = "Profile"
    this.notes = "Notes"
  }

  displayName(): string {
    return this.firstName + " " + this.lastName;
  }
}
