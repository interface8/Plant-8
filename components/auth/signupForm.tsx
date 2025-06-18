"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, UserPlus, CheckCircle } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { useFormValidation } from "@/hooks/use-form-validation";
import { signUpSchema, type SignUpFormData } from "@/lib/validators";

interface SignUpFormProps {
  onSubmit: (data: SignUpFormData) => Promise<boolean>;
  isLoading?: boolean;
  error?: string;
}

export function SignUpForm({
  onSubmit,
  isLoading = false,
  error,
}: SignUpFormProps) {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    errors,
    touched,
    validateField,
    validateForm,
    setFieldTouched,
    clearErrors,
  } = useFormValidation(signUpSchema);

  const handleInputChange = (field: keyof SignUpFormData, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    // Validate field immediately if it has been touched
    if (touched[field]) {
      validateField(field, value, newFormData);
    }

    // Special handling for password confirmation - validate confirm password when password changes
    if (
      field === "password" &&
      touched.confirmPassword &&
      formData.confirmPassword
    ) {
      validateField("confirmPassword", formData.confirmPassword, newFormData);
    }
  };

  const handleBlur = (field: keyof SignUpFormData) => {
    setFieldTouched(field);
    validateField(field, formData[field], formData);
  };

  const handleFocus = (field: keyof SignUpFormData) => {
    // Clear field error when user starts typing again
    if (errors[field]) {
      // Don't clear immediately, let them start typing
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    Object.keys(formData).forEach((field) => setFieldTouched(field));

    if (validateForm(formData)) {
      try {
        const success = await onSubmit(formData);
        if (success) {
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          clearErrors();
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch =
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  // Check if form is valid
  const isFormValid =
    Object.keys(errors).length === 0 &&
    Object.values(formData).every((value) => value.trim().length > 0) &&
    formData.password === formData.confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <FormField
        id="name"
        label="Full Name"
        type="text"
        value={formData.name}
        onChange={(e) => handleInputChange("name", e.target.value)}
        onBlur={() => handleBlur("name")}
        onFocus={() => handleFocus("name")}
        error={errors.name}
        touched={touched.name}
        success={touched.name && !errors.name && formData.name.length > 0}
        disabled={isLoading}
        placeholder="Enter your full name"
        autoComplete="name"
        required
        helperText="Enter your first and last name"
      />

      <FormField
        id="email"
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
        onBlur={() => handleBlur("email")}
        onFocus={() => handleFocus("email")}
        error={errors.email}
        touched={touched.email}
        success={touched.email && !errors.email && formData.email.length > 0}
        disabled={isLoading}
        placeholder="Enter your email address"
        autoComplete="email"
        required
        helperText="We'll use this to send you important updates"
      />

      <div className="space-y-2">
        <FormField
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          onBlur={() => handleBlur("password")}
          onFocus={() => handleFocus("password")}
          error={errors.password}
          touched={touched.password}
          disabled={isLoading}
          placeholder="Create a strong password"
          autoComplete="new-password"
          required
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        {formData.password && (
          <div className="space-y-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i < passwordStrength
                      ? passwordStrength <= 2
                        ? "bg-red-500"
                        : passwordStrength <= 3
                        ? "bg-yellow-500"
                        : "bg-green-500"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <p
              className={`text-xs ${
                passwordStrength <= 2
                  ? "text-red-600"
                  : passwordStrength <= 3
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              Password strength:{" "}
              {passwordStrength <= 2
                ? "Weak"
                : passwordStrength <= 3
                ? "Medium"
                : "Strong"}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <FormField
          id="confirmPassword"
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          onBlur={() => handleBlur("confirmPassword")}
          onFocus={() => handleFocus("confirmPassword")}
          error={errors.confirmPassword}
          touched={touched.confirmPassword}
          disabled={isLoading}
          placeholder="Confirm your password"
          autoComplete="new-password"
          required
          showPasswordToggle
          showPassword={showConfirmPassword}
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        {passwordsMatch && touched.confirmPassword && (
          <div className="flex items-center text-green-600 text-sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            Passwords match perfectly!
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          <>
            <UserPlus className="mr-2 h-4 w-4" />
            Create Account
          </>
        )}
      </Button>

      {/* Form validation summary */}
      {Object.keys(touched).length > 0 && Object.keys(errors).length > 0 && (
        <div className="text-sm text-gray-600">
          <p className="font-medium">Please fix the following issues:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field} className="text-red-600">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}

// "use client";

// import type React from "react";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
// import { SignUpFormData } from "@/lib/validators";

// interface SignUpFormProps {
//   onSubmit: (data: SignUpFormData) => Promise<boolean>;
//   isLoading?: boolean;
//   error?: string;
// }

// export function SignUpForm({
//   onSubmit,
//   isLoading = false,
//   error,
// }: SignUpFormProps) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const success = await onSubmit({ name, email, password, confirmPassword });

//     if (success) {
//       setName("");
//       setEmail("");
//       setPassword("");
//       setConfirmPassword("");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       {error && (
//         <Alert variant="destructive">
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       <div className="space-y-2">
//         <Label htmlFor="name">Full Name</Label>
//         <Input
//           id="name"
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//           disabled={isLoading}
//           placeholder="Enter your full name"
//           className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="email">Email</Label>
//         <Input
//           id="email"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           disabled={isLoading}
//           placeholder="Enter your email"
//           className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="password">Password</Label>
//         <div className="relative">
//           <Input
//             id="password"
//             type={showPassword ? "text" : "password"}
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             disabled={isLoading}
//             placeholder="Enter your password"
//             minLength={8}
//             className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 pr-10"
//           />
//           <Button
//             type="button"
//             variant="ghost"
//             size="sm"
//             className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//             onClick={() => setShowPassword(!showPassword)}
//             disabled={isLoading}
//           >
//             {showPassword ? (
//               <EyeOff className="h-4 w-4" />
//             ) : (
//               <Eye className="h-4 w-4" />
//             )}
//           </Button>
//         </div>
//         <p className="text-xs text-muted-foreground">
//           Password must be at least 8 characters long
//         </p>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="confirmPassword">Confirm Password</Label>
//         <div className="relative">
//           <Input
//             id="confirmPassword"
//             type={showConfirmPassword ? "text" : "password"}
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//             disabled={isLoading}
//             placeholder="Confirm your password"
//             minLength={8}
//             className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 pr-10"
//           />
//           <Button
//             type="button"
//             variant="ghost"
//             size="sm"
//             className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//             onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//             disabled={isLoading}
//           >
//             {showConfirmPassword ? (
//               <EyeOff className="h-4 w-4" />
//             ) : (
//               <Eye className="h-4 w-4" />
//             )}
//           </Button>
//         </div>
//         {password && confirmPassword && password === confirmPassword && (
//           <div className="flex items-center text-green-600 text-xs">
//             <CheckCircle className="h-3 w-3 mr-1" />
//             Passwords match
//           </div>
//         )}
//       </div>

//       <Button
//         type="submit"
//         className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
//         disabled={isLoading}
//       >
//         {isLoading ? (
//           <>
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             Creating Account...
//           </>
//         ) : (
//           "Create Account"
//         )}
//       </Button>
//     </form>
//   );
// }
