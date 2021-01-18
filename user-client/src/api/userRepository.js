import axios from "axios";
import { User, UserSummary } from "@/data/user";
export default class UserRepository {
    async fetchUserSummaries() {
        const response = await axios.get(`/api/v1/users`);
        return response.data.items.map((e) => new UserSummary(e));
    }
    async userSummariesById(userId) {
        const response = await axios.get(`/api/v1/summaries?userId=${userId}`);
        return response.data;
    }
    async fetchUser(userId) {
        const response = await axios.get(`/api/v1/users/${userId}`);
        return new User(response.data);
    }
}
//# sourceMappingURL=userRepository.js.map