export interface CustomerDTO {
  id: number;
  fullName?: string | null;
  emailId?: string | null;
  contactNo?: string | null;
  whatsappNo?: string | null;
  gstNumber?: string | null;
  state?: number | null;
  addressone?: string | null;
  status: number;
}

export interface CategoryDTO {
  id: number;
  catName?: string | null;
  catCode: string;
  catDesc?: string | null;
  categoryImage?: string | null;
  status: number;
}

export interface ProductRegisterDTO {
  id: number;
  productId?: number | null;
  productName?: string | null;
  newProtype?: string | null;
  displaySection?: string | null;
  shdesc?: string | null;
  lgdesc?: string | null;
  keyFeatures?: string | null;
  cancelReturns?: string | null;
  overview?: string | null;
  proimg?: string | null;
  isDisplay?: string | null;
  deliveryDays?: number | null;
  ratings?: any | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface ProductImageRegisterDTO {
  id: number;
  productId?: number | null;
  proimgs?: string | null;
  status?: string | null;
}

export interface ProductRatingDTO {
  id: number;
  productId?: number | null;
  totalRatings?: number | null;
  givenRatings?: number | null;
  message?: string | null;
  createdAt: Date;
}

export interface UserAddressDTO {
  id: number;
  customerId?: number | null;
  address?: string | null;
  townCity?: string | null;
  pincode?: string | null;
  receiversName?: string | null;
  receiversNumber?: string | null;
  saveAs?: string | null;
}

export interface CouponCodeDTO {
  id: number;
  name?: string | null;
  description?: string | null;
  termsConditions?: string | null;
  validCategory?: string | null;
  validPrice?: any | null;
  validDate?: Date | null;
}
