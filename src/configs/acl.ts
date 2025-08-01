// import { AbilityBuilder, Ability } from '@casl/ability'

// export type Subjects = string
// export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'

// export type AppAbility = Ability<[Actions, Subjects]> | undefined

// export const AppAbility = Ability as any
// export type ACLObj = {
//   action: Actions
//   subject: string
// }

// /**
//  * Please define your own Ability rules according to your app requirements.
//  * We have just shown Admin and Client rules for demo purpose where
//  * admin can manage everything and client can just visit ACL page
//  */
// const defineRulesFor = (role: string, subject: string) => {
//   const { can, rules } = new AbilityBuilder(AppAbility)

//   if (role === 'admin') {
//     can('manage', 'all')
//   }

//   return rules
// }

// export const buildAbilityFor = (role: string, subject: string): AppAbility => {
//   return new AppAbility(defineRulesFor(role, subject), {
//     // https://casl.js.org/v5/en/guide/subject-type-detection
//     // @ts-ignore
//     detectSubjectType: object => object!.type
//   })
// }

// export const defaultACLObj: ACLObj = {
//   action: 'manage',
//   subject: 'all'
// }

// export default defineRulesFor

import { AbilityBuilder, Ability } from '@casl/ability'

export type Subjects = string
export type Actions = 'access'

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any

export type ACLObj = {
  action: Actions
  subject: string
  roles: string[] // Thêm danh sách role được phép
}

const defineRulesFor = (role: string) => {
  const { can, rules } = new AbilityBuilder(AppAbility)

  if (role === 'ADMIN') {
    can('access', 'all') // Admin có quyền truy cập tất cả
  } else if (role === 'CUSTOMER') {
    can('access', ['all'])
  } else {
    can('access', ['all'])
  }

  return rules
}

export const buildAbilityFor = (role: string): AppAbility => {
  return new AppAbility(defineRulesFor(role), {
    detectSubjectType: (object: any) => object?.type || 'all'
  })
}

export const defaultACLObj: ACLObj = {
  action: 'access',
  subject: 'all',
  roles: ['ADMIN', 'CUSTOMER', 'STAFF'] // Mặc định chỉ admin truy cập được
}

export default defineRulesFor
