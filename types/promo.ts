export interface PromoCode {
    _id: string
    code: string
    discountPercentage: number
    validFrom: string
    validTo: string
  }
  
  export interface PromoCodeResult {
    valid: boolean
    discountAmount: number
  }
  
  