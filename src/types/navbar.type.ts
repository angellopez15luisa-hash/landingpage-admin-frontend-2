import z from 'zod'
import { navbarDataResponseSchema, navbarSchema } from '../schemas/navbar.schema'

export type Navbar = z.infer<typeof navbarSchema>

export type NavbarEditForm = Pick<Navbar, 'textLogo' | 'hrefLogo' | 'textBtn' | 'hrefBtn'>

export type NavbarEditFormData = {
  id: Navbar['id']
  data: NavbarEditForm
}

export type NavbarDataResponse = z.infer<typeof navbarDataResponseSchema>
