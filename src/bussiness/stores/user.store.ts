import type { UserProfile } from "@/types/user.type";
import { UserValue } from "@/values";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { UserAction } from "../actions";
import { userGetProfileResponseSchema } from "@/schemas/user.schema";


export const useUserStore = defineStore('user', () => {

  const user = ref<UserProfile>(UserValue.userProfile)
  const isAuthenticated = ref<boolean>(false)

  const checkAuth = async () :Promise<void> => {
    try {
      const data = await UserAction.getProfile()
      const response = userGetProfileResponseSchema.safeParse(data)
      if (response.success) {
        user.value = response.data
        isAuthenticated.value = true
      }
    } catch {
      isAuthenticated.value = false
    }
  }

  const logout = () => {
    user.value = UserValue.userProfile
    isAuthenticated.value = false
    localStorage.removeItem('TOKEN_LANDINGPAGE')
  }

  return {
    checkAuth,
    logout,
    user,
    isAuthenticated:computed(()=>isAuthenticated.value)
  }
})
