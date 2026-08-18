import type { NavbarEditFormData } from '@/types/navbar.type'
import { NavbarService } from '../services'

export class NavbarAction {
  static get() {
    return NavbarService.get()
  }
  static update(formData: NavbarEditFormData) {
    return NavbarService.update(formData)
  }
}
