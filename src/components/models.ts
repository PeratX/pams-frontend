/* eslint-disable @typescript-eslint/no-explicit-any */
export enum PamsResponseCode {
  ERR,
  OK
}

export enum PamsRole {
  NONE,
  VIEWER,
  ADMIN
}

export type PamsAsset = {
  id: number,
  label: string,
  value: number,
  description: string,
  amount: number
}

export type PamsLog = {
  id: number,
  amount: number,
  action: number,
  message: string,
  user: {
    name: string,
    role: number
  },
  asset: PamsAsset
}

export type PamsResponse<T> = {
  code: PamsResponseCode,
  msg: string,
  data: T | undefined
}

export type PamsUserInfo = {
  name: string,
  role: PamsRole
}
