import axios from "axios"
import {User, UserSummary} from "@/data/user"

export default class UserRepository {
  public async fetchUserSummaries(): Promise<Array<UserSummary>> {
    const response = await axios.get(`/api/v1/users`)
    return response.data.items.map((e: any) => new UserSummary(e))
  }

  public async userSummariesById(userId: number): Promise<Array<UserSummary>> {
    const response = await axios.get(`/api/v1/summaries?userId=${userId}`)
    return (response.data as Array<UserSummary>)
  }

  public async fetchUser(userId: number): Promise<User> {
    const response = await axios.get(`/api/v1/users/${userId}`)
    return new User(response.data)
  }
}
