export interface ICountry {
  id: number
  name: string
  code: string
  blocked: number
  regions: IRegion[]
}
export interface IRegion {
  id: number
  name: string
  code: string
  blocked: number
}
