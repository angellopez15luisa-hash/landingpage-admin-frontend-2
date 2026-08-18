import api from '@/lib/axios'
import type { MessageResponse } from '@/types/custom.type'
import type { NavbarDataResponse, NavbarEditFormData } from '@/types/navbar.type'

export class NavbarApi {
  static get() {
    return api.get<NavbarDataResponse>(`/navbars/get`)
  }

  static update(formData: NavbarEditFormData) {
    return api.patch<MessageResponse>(`/navbars/update/${formData.id}`, formData.data)
  }
}
