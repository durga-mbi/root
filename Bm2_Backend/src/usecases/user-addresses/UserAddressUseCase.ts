import * as userAddressRepository from "../../data/repositories/user-addresses/UserAddressRepository";
import { CustomerRepository } from "../../data/repositories/auth/CustomerRepository";
import AppError from "../../errors/AppError";

const customerRepository = new CustomerRepository();

export const getUserAddressById = async (id: number) => {
  const address = await userAddressRepository.getUserAddressById(id);
  if (!address) {
    throw AppError.notFound(`Address not found`);
  }
  return address;
};

export const getUserAddressesByCustomerId = async (
  customerId: number,
  limit?: number,
  cursor?: number,
) => {
  const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
  const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
  return await userAddressRepository.getUserAddressesByCustomerId(
    customerId,
    queryLimit,
    queryCursor,
  );
};

export const getAllUserAddresses = async (limit?: number, cursor?: number) => {
  const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
  const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
  return await userAddressRepository.getAllUserAddresses(
    queryLimit,
    queryCursor,
  );
};

export const createUserAddress = async (
  data: userAddressRepository.CreateUserAddressData,
) => {
  if (data.pincode && !/^\d{6}$/.test(data.pincode)) {
    throw AppError.badRequest("PIN code must be 6 digits");
  }

  if (
    data.receiversNumber &&
    !/^\d{10}$/.test(data.receiversNumber.replace(/\D/g, ""))
  ) {
    throw AppError.badRequest("Receiver's number must be 10 digits");
  }

  if (data.saveAs) {
    const validValues = ["Home", "Work", "Other"];
    if (!validValues.includes(data.saveAs)) {
      throw AppError.badRequest("Invalid save as value");
    }
  }

  return await userAddressRepository.createUserAddress(data);
};

export const updateUserAddress = async (
  id: number,
  data: userAddressRepository.UpdateUserAddressData,
) => {
  const existingAddress = await userAddressRepository.getUserAddressById(id);
  if (!existingAddress) {
    throw AppError.notFound(`Address not found`);
  }

  // customerId renamed to userId in table but repo returns userId as property
  // Wait, let me check what type Prisma generates now
  const address = existingAddress as any;
  if (address.userId !== data.customerId) {
    throw AppError.forbidden("Permission denied to update this address");
  }

  if (data.pincode && !/^\d{6}$/.test(data.pincode)) {
    throw AppError.badRequest("PIN code must be 6 digits");
  }

  if (
    data.receiversNumber &&
    !/^\d{10}$/.test(data.receiversNumber.replace(/\D/g, ""))
  ) {
    throw AppError.badRequest("Receiver's number must be 10 digits");
  }

  if (data.saveAs) {
    const validValues = ["Home", "Work", "Other"];
    if (!validValues.includes(data.saveAs)) {
      throw AppError.badRequest("Invalid save as value");
    }
  }

  return await userAddressRepository.updateUserAddress(id, data);
};

export const deleteUserAddress = async (id: number, customerId: number) => {
  const existingAddress = await userAddressRepository.getUserAddressById(id);
  if (!existingAddress) {
    throw AppError.notFound(`Address not found`);
  }

  const address = existingAddress as any;
  if (address.userId !== customerId) {
    throw AppError.forbidden("Permission denied to delete this address");
  }

  return await userAddressRepository.deleteUserAddress(id);
};
