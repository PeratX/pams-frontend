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
  description: string
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
