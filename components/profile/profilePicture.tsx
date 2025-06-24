import { useState } from "react";
import Image from "next/image";
import { Camera, Upload, X } from "lucide-react";
import { UserProfile } from "@/types/user";
import { getUserInitials } from "@/lib/utils";

interface ProfilePictureProps {
  user: UserProfile;
  onImageUpload: (
    file: File,
    onProgress?: (progress: number) => void
  ) => Promise<UserProfile>;
}

export function ProfilePicture({ user, onImageUpload }: ProfilePictureProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
        alert("Only JPEG, PNG, and WebP images are allowed");
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!imageFile) return;

    setIsUploading(true);
    try {
      await onImageUpload(imageFile, setUploadProgress);
      setImageFile(null);
      setImagePreview(null);
      setUploadProgress(0);
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setUploadProgress(0);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-green-100 p-8 sticky top-18 text-center hover:shadow-2xl transition-all duration-300">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-center gap-2">
        <Camera className="w-5 h-5 text-green-600" />
        Profile Picture
      </h2>

      {/* Profile Picture */}
      <div className="relative inline-block mb-6">
        {imagePreview ? (
          <Image
            src={imagePreview}
            alt="Preview"
            width={150}
            height={150}
            className="rounded-full object-cover ring-4 ring-green-200 shadow-lg"
          />
        ) : user.image ? (
          <Image
            src={user.image}
            alt="Profile picture"
            width={150}
            height={150}
            className="rounded-full object-cover ring-4 ring-green-200 shadow-lg"
          />
        ) : (
          <div className="w-36 h-36 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center text-4xl font-bold ring-4 ring-green-200 shadow-lg">
            {getUserInitials(user.name)}
          </div>
        )}
        <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
          <Camera className="w-5 h-5 text-green-600" />
        </div>
      </div>

      {/* File Input */}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleImageChange}
        className="hidden"
        id="profile-image"
        disabled={isUploading}
      />
      <label
        htmlFor="profile-image"
        className={`inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-2xl font-medium transition-all duration-200 shadow-lg transform hover:-translate-y-0.5 ${
          isUploading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 cursor-pointer"
        }`}
      >
        <Camera className="w-5 h-5" />
        Choose New Photo
      </label>

      {/* Upload + Cancel Buttons */}
      {imageFile && (
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 text-white rounded-2xl font-semibold backdrop-blur-sm shadow-xl hover:shadow-2xl hover:scale-[1.015] transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-5 h-5" />
              {isUploading ? "Uploading..." : "Upload Photo"}
            </button>

            {/* Cancel Button */}
            <button
              onClick={handleCancel}
              disabled={isUploading}
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-white text-gray-800 border border-gray-300 rounded-2xl font-semibold backdrop-blur-sm shadow-md hover:bg-gray-100 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>

          {/* Upload Progress */}
          {uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-slate-600 font-medium">
                {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      )}

      {/* Guidelines */}
      <div className="mt-6 text-xs text-gray-500 space-y-1">
        <p>• Maximum file size: 5MB</p>
        <p>• Supported formats: JPEG, PNG, WebP</p>
      </div>
    </div>
  );
}

// import { useState } from "react";
// import Image from "next/image";
// import { Camera, Upload, X } from "lucide-react";
// import { UserProfile } from "@/types/user";
// import { getUserInitials } from "@/lib/utils";

// interface ProfilePictureProps {
//   user: UserProfile;
//   onImageUpload: (
//     file: File,
//     onProgress?: (progress: number) => void
//   ) => Promise<UserProfile>;
// }

// export function ProfilePicture({ user, onImageUpload }: ProfilePictureProps) {
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [uploadProgress, setUploadProgress] = useState<number>(0);
//   const [isUploading, setIsUploading] = useState(false);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Validate file size (5MB max)
//       if (file.size > 5 * 1024 * 1024) {
//         alert("File size must be less than 5MB");
//         return;
//       }

//       // Validate file type
//       if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
//         alert("Only JPEG, PNG, and WebP images are allowed");
//         return;
//       }

//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleUpload = async () => {
//     if (!imageFile) return;

//     setIsUploading(true);
//     try {
//       await onImageUpload(imageFile, setUploadProgress);
//       setImageFile(null);
//       setImagePreview(null);
//       setUploadProgress(0);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleCancel = () => {
//     setImageFile(null);
//     setImagePreview(null);
//     setUploadProgress(0);
//     if (imagePreview) {
//       URL.revokeObjectURL(imagePreview);
//     }
//   };

//   return (
//     <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 p-6 sticky top-8">
//       <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
//         <Camera className="h-5 w-5 mr-2 text-green-600" />
//         Profile Picture
//       </h2>

//       <div className="text-center">
//         {/* Current/Preview Image */}
//         <div className="relative inline-block mb-6">
//           {imagePreview ? (
//             <Image
//               src={imagePreview}
//               alt="Preview"
//               width={160}
//               height={160}
//               className="rounded-2xl object-cover shadow-lg ring-4 ring-green-200"
//             />
//           ) : user.image ? (
//             <Image
//               src={user.image}
//               alt="Profile picture"
//               width={160}
//               height={160}
//               className="rounded-2xl object-cover shadow-lg ring-4 ring-green-200"
//             />
//           ) : (
//             <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center text-4xl font-bold shadow-lg ring-4 ring-green-200">
//               {getUserInitials(user.name)}
//             </div>
//           )}

//           {/* Upload overlay for preview */}
//           {imagePreview && (
//             <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center">
//               <div className="text-white text-sm font-medium">Preview</div>
//             </div>
//           )}
//         </div>

//         {/* File Input */}
//         <div className="mb-4">
//           <input
//             type="file"
//             accept="image/jpeg,image/png,image/webp"
//             onChange={handleImageChange}
//             className="hidden"
//             id="profile-image"
//             disabled={isUploading}
//           />
//           <label
//             htmlFor="profile-image"
//             className={`inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
//               isUploading
//                 ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//             }`}
//           >
//             <Camera className="h-5 w-5 mr-2" />
//             Choose New Photo
//           </label>
//         </div>

//         {/* Upload Controls */}
//         {imageFile && (
//           <div className="space-y-4">
//             <div className="flex justify-center space-x-3">
//               <button
//                 onClick={handleUpload}
//                 disabled={isUploading}
//                 className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//               >
//                 <Upload className="h-4 w-4 mr-2" />
//                 {isUploading ? "Uploading..." : "Upload"}
//               </button>
//               <button
//                 onClick={handleCancel}
//                 disabled={isUploading}
//                 className="inline-flex items-center px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//               >
//                 <X className="h-4 w-4 mr-2" />
//                 Cancel
//               </button>
//             </div>

//             {/* Progress Bar */}
//             {uploadProgress > 0 && (
//               <div className="w-full">
//                 <div className="flex justify-between text-sm text-gray-600 mb-1">
//                   <span>Uploading...</span>
//                   <span>{uploadProgress}%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
//                   <div
//                     className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300 ease-out"
//                     style={{ width: `${uploadProgress}%` }}
//                   ></div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Guidelines */}
//         <div className="mt-6 text-xs text-gray-500 space-y-1">
//           <p>• Maximum file size: 5MB</p>
//           <p>• Supported formats: JPEG, PNG, WebP</p>
//           <p>• Recommended: Square images (1:1 ratio)</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import axios from "axios";
// import Image from "next/image";
// import { toast } from "sonner";
// import { UserProfile } from "../../types/user";
// import { Camera, Upload } from "lucide-react";
// import { getUserInitials } from "../../lib/utils";

// /**
//  * Props for ProfilePicture component.
//  */
// interface ProfilePictureProps {
//   user: UserProfile;
//   setUser: (user: UserProfile) => void;
// }

// /**
//  * Component for managing user profile picture.
//  */
// export default function ProfilePicture({ user, setUser }: ProfilePictureProps) {
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [uploadProgress, setUploadProgress] = useState<number>(0);
//   const [isUploading, setIsUploading] = useState(false);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const uploadImage = async () => {
//     if (!imageFile) return;
//     setIsUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append("image", imageFile);
//       const { data } = await axios.post<UserProfile>(
//         "/api/user/image",
//         formData,
//         {
//           onUploadProgress: (progressEvent) => {
//             if (progressEvent.total) {
//               setUploadProgress(
//                 Math.round((progressEvent.loaded * 100) / progressEvent.total)
//               );
//             }
//           },
//         }
//       );
//       setUser(data);
//       setImageFile(null);
//       setImagePreview(null);
//       setUploadProgress(0);
//       toast.success("Profile picture updated");
//     } catch (error: any) {
//       toast.error(error.response?.data?.error || "Failed to upload image");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 text-center">
//       <div className="relative inline-block mb-4">
//         {imagePreview ? (
//           <Image
//             src={imagePreview}
//             alt="Preview"
//             width={120}
//             height={120}
//             className="rounded-full object-cover ring-2 ring-green-200"
//           />
//         ) : user.image ? (
//           <Image
//             src={user.image}
//             alt="Profile picture"
//             width={120}
//             height={120}
//             className="rounded-full object-cover ring-2 ring-green-200"
//           />
//         ) : (
//           <div className="w-30 h-30 rounded-full bg-green-600 text-white flex items-center justify-center text-3xl font-medium ring-2 ring-green-200">
//             {getUserInitials(user.name)}
//           </div>
//         )}
//         <label
//           htmlFor="profile-image"
//           className="absolute -bottom-2 -right-2 bg-green-600 text-white rounded-full p-2 cursor-pointer hover:bg-green-700"
//           aria-label="Change profile picture"
//         >
//           <Camera className="h-4 w-4" />
//           <input
//             type="file"
//             accept="image/jpeg,image/png,image/webp"
//             onChange={handleImageChange}
//             className="hidden"
//             id="profile-image"
//           />
//         </label>
//       </div>
//       <h2 className="text-xl font-semibold text-gray-800 mb-2">{user.name}</h2>
//       <p className="text-gray-600 mb-4">{user.email}</p>
//       {imageFile && (
//         <div className="space-y-2">
//           <button
//             onClick={uploadImage}
//             disabled={isUploading}
//             className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
//             aria-label={isUploading ? "Uploading image" : "Upload image"}
//           >
//             <Upload className="h-4 w-4" />
//             {isUploading ? "Uploading..." : "Upload Photo"}
//           </button>
//           {uploadProgress > 0 && (
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div
//                 className="bg-green-600 h-2 rounded-full"
//                 style={{ width: `${uploadProgress}%` }}
//               />
//             </div>
//           )}
//         </div>
//       )}
//       {user.modifiedOn && (
//         <p className="text-sm text-gray-500 mt-4">
//           Updated{" "}
//           {new Date(user.modifiedOn).toLocaleDateString("en-NG", {
//             timeZone: "Africa/Lagos",
//           })}
//         </p>
//       )}
//     </div>
//   );
// }
