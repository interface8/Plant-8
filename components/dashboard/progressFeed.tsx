import prisma from "@/db/prisma";
import { auth } from "@/auth";
import NotificationsList from "./notifications-list";

export default async function ProgressFeed() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const unreadCount = await prisma.notification.count({
    where: {
      userId: session.user.id,
      read: false,
    },
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">
          Notifications
        </h2>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>
      <NotificationsList 
        initialNotifications={notifications.map(n => ({
          ...n,
          createdAt: n.createdAt.toISOString(),
        }))} 
        unreadCount={unreadCount}
      />
    </div>
  );
}

// export default function ProgressFeed() {
//   const updates = [
//     {
//       id: 1,
//       project: "Organic Avocado Farm",
//       update: "Planted 500 new avocado trees.",
//       date: "2025-05-01",
//     },
//     {
//       id: 2,
//       project: "Free-Range Poultry",
//       update: "New coop construction completed.",
//       date: "2025-04-28",
//     },
//     {
//       id: 3,
//       project: "Sustainable Cocoa",
//       update: "Initial soil testing completed with excellent results.",
//       date: "2025-04-25",
//     },
//   ];

//   const formatDate = (dateString: string | number | Date) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//     });
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
//       <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">
//         Recent Updates
//       </h2>
//       <div className="space-y-3 md:space-y-4">
//         {updates.map((update) => (
//           <div
//             key={update.id}
//             className="border-l-4 border-green-500 pl-3 md:pl-4 py-2"
//           >
//             <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
//               <div className="flex-1">
//                 <h3 className="font-medium text-gray-900 text-sm md:text-base">
//                   {update.project}
//                 </h3>
//                 <p className="text-gray-600 text-sm md:text-base mt-1">
//                   {update.update}
//                 </p>
//               </div>
//               <span className="text-xs md:text-sm text-gray-500 whitespace-nowrap">
//                 {formatDate(update.date)}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
