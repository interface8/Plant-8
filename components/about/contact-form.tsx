// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import emailjs from "@emailjs/browser";
// import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
// import { contactFormSchema, type ContactFormData } from "@/lib/validators";

// export default function ContactForm() {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState<
//     "idle" | "success" | "error"
//   >("idle");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<ContactFormData>({
//     resolver: zodResolver(contactFormSchema),
//   });

//   const onSubmit = async (data: ContactFormData) => {
//     setIsSubmitting(true);
//     setSubmitStatus("idle");

//     try {
//       await emailjs.send(
//         process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
//         process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
//         {
//           from_name: data.name,
//           from_email: data.email,
//           message: data.message,
//           to_name: "FAM 8 Team",
//           current_date: new Date().toLocaleString("en-NG", {
//             timeZone: "Africa/Lagos",
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//             hour: "2-digit",
//             minute: "2-digit",
//           }),
//         },
//         process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
//       );

//       setSubmitStatus("success");
//       reset();
//     } catch (error) {
//       console.error("EmailJS Error:", error);
//       setSubmitStatus("error");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <section className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
//       <div className="text-center mb-12">
//         <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
//           Get in Touch
//         </h2>
//         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//           Have questions about FAM 8 or interested in investing? We&apos;d love
//           to hear from you. Send us a message and we&apos;ll respond promptly.
//         </p>
//       </div>

//       <div className="max-w-2xl mx-auto">
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           {/* Name Field */}
//           <div>
//             <label
//               htmlFor="name"
//               className="block text-sm font-medium text-gray-700 mb-2"
//             >
//               Full Name *
//             </label>
//             <input
//               type="text"
//               id="name"
//               {...register("name")}
//               className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
//                 errors.name ? "border-red-500" : "border-gray-300"
//               }`}
//               placeholder="Enter your full name"
//               aria-invalid={errors.name ? "true" : "false"}
//               aria-describedby={errors.name ? "name-error" : undefined}
//             />
//             {errors.name && (
//               <p
//                 id="name-error"
//                 className="mt-1 text-sm text-red-600 flex items-center gap-1"
//               >
//                 <AlertCircle className="w-4 h-4" />
//                 {errors.name.message}
//               </p>
//             )}
//           </div>

//           {/* Email Field */}
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700 mb-2"
//             >
//               Email Address *
//             </label>
//             <input
//               type="email"
//               id="email"
//               {...register("email")}
//               className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
//                 errors.email ? "border-red-500" : "border-gray-300"
//               }`}
//               placeholder="Enter your email address"
//               aria-invalid={errors.email ? "true" : "false"}
//               aria-describedby={errors.email ? "email-error" : undefined}
//             />
//             {errors.email && (
//               <p
//                 id="email-error"
//                 className="mt-1 text-sm text-red-600 flex items-center gap-1"
//               >
//                 <AlertCircle className="w-4 h-4" />
//                 {errors.email.message}
//               </p>
//             )}
//           </div>

//           {/* Message Field */}
//           <div>
//             <label
//               htmlFor="message"
//               className="block text-sm font-medium text-gray-700 mb-2"
//             >
//               Message *
//             </label>
//             <textarea
//               id="message"
//               rows={6}
//               {...register("message")}
//               className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-vertical ${
//                 errors.message ? "border-red-500" : "border-gray-300"
//               }`}
//               placeholder="Tell us about your inquiry or how we can help you..."
//               aria-invalid={errors.message ? "true" : "false"}
//               aria-describedby={errors.message ? "message-error" : undefined}
//             />
//             {errors.message && (
//               <p
//                 id="message-error"
//                 className="mt-1 text-sm text-red-600 flex items-center gap-1"
//               >
//                 <AlertCircle className="w-4 h-4" />
//                 {errors.message.message}
//               </p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <div>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-teal-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//               aria-describedby="submit-status"
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   Sending Message...
//                 </>
//               ) : (
//                 <>
//                   <Send className="w-5 h-5" />
//                   Send Message
//                 </>
//               )}
//             </button>
//           </div>

//           {/* Status Messages */}
//           {submitStatus !== "idle" && (
//             <div
//               id="submit-status"
//               className={`p-4 rounded-lg flex items-center gap-3 ${
//                 submitStatus === "success"
//                   ? "bg-green-50 text-green-800 border border-green-200"
//                   : "bg-red-50 text-red-800 border border-red-200"
//               }`}
//               role="alert"
//             >
//               {submitStatus === "success" ? (
//                 <>
//                   <CheckCircle className="w-5 h-5" />
//                   <span>
//                     Message sent successfully! We&apos;ll get back to you soon.
//                   </span>
//                 </>
//               ) : (
//                 <>
//                   <AlertCircle className="w-5 h-5" />
//                   <span>
//                     Failed to send message. Please try again or contact us
//                     directly.
//                   </span>
//                 </>
//               )}
//             </div>
//           )}
//         </form>

//         {/* Alternative Contact Methods */}
//         <div className="mt-12 text-center">
//           <p className="text-gray-600 mb-4">Or reach out to us directly:</p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <a
//               href="mailto:info@fam8.ng"
//               className="text-green-600 hover:text-green-700 font-medium transition-colors"
//             >
//               info@fam8.ng
//             </a>
//             <span className="hidden sm:block text-gray-400">|</span>
//             <a
//               href="tel:+2348021234567"
//               className="text-green-600 hover:text-green-700 font-medium transition-colors"
//             >
//               +234 (0) 802 123 4567
//             </a>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
