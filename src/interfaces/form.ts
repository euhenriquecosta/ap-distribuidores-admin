export type EnumPlanType = "starter" | "pro" | "master"

export interface IFormData {
  PLAN_TYPE: EnumPlanType
  FIRST_NAME: string
  LAST_NAME: string
  EMAIL: string
  PHONE_NUMBER: string
  WHATSAPP_NUMBER: string
  ADDRESS: string
  LATITUDE: number
  LONGITUDE: number
}