/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { UserProfile, Address } from "@/types/user";
import { UserFormData, AddressFormData } from "@/lib/validators";

export function useProfileData() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [addressTypes, setAddressTypes] = useState<
    { id: string; name: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (status !== "authenticated" || !session?.user?.id) return;

    try {
      const { data } = await axios.get<UserProfile>("/api/user/profile");
      setUser(data);
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }, [status, session?.user?.id]);

  const fetchAddressTypes = useCallback(async () => {
    try {
      const { data } = await axios.get<{ id: string; name: string }[]>(
        "/api/address-types"
      );
      setAddressTypes(data);
    } catch (error) {
      toast.error("Failed to load address types");
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
      fetchAddressTypes();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status, fetchProfile, fetchAddressTypes]);

  const updateProfile = async (data: UserFormData) => {
    try {
      const response = await axios.put<UserProfile>("/api/user/profile", data);
      setUser(response.data);
      toast.success("Profile updated successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update profile");
      throw error;
    }
  };

  const uploadProfileImage = async (
    file: File,
    onProgress?: (progress: number) => void
  ) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.post<UserProfile>(
        "/api/user/profile/image",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total && onProgress) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(percent);
            }
          },
        }
      );

      setUser(data);
      toast.success("Profile picture updated successfully");
      return data;
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to upload image");
      throw error;
    }
  };

  const addAddress = async (data: AddressFormData) => {
    try {
      const response = await axios.post<Address>("/api/user/addresses", data);
      setUser((prev) => ({
        ...prev!,
        addresses: [...prev!.addresses, response.data],
      }));
      toast.success("Address added successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add address");
      throw error;
    }
  };

  const updateAddress = async (id: string, data: AddressFormData) => {
    try {
      const response = await axios.put<Address>(
        `/api/user/addresses/${id}`,
        data
      );
      setUser((prev) => ({
        ...prev!,
        addresses: prev!.addresses.map((addr) =>
          addr.id === id ? response.data : addr
        ),
      }));
      toast.success("Address updated successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update address");
      throw error;
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      await axios.delete(`/api/user/addresses/${id}`);
      setUser((prev) => ({
        ...prev!,
        addresses: prev!.addresses.filter((address) => address.id !== id),
      }));
      toast.success("Address deleted successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete address");
      throw error;
    }
  };

  return {
    user,
    addressTypes,
    isLoading,
    updateProfile,
    uploadProfileImage,
    addAddress,
    updateAddress,
    deleteAddress,
  };
}
