import { redirect } from "next/navigation";
import Head from "next/head";
import { auth } from "@/auth";
import LandForm from "@/components/admin/land-form";
import { getLocations } from "@/lib/services/investment-service";

export default async function NewLandPage() {
  const session = await auth();
  if (!session?.user || !session?.user?.roles?.includes("ADMIN")) {
    redirect("/sign-in");
  }

  const locations = await getLocations();
  if (!locations || locations.length === 0) {
    console.error("No locations found in database");
    redirect("/admin/lands?error=no-locations");
  }

  return (
    <>
      <Head>
        <title>Create New Land - FAM 8 Admin</title>
        <meta
          name="description"
          content="Create a new land for agricultural investments in FAM 8."
        />
        <meta
          name="keywords"
          content="admin, land creation, agricultural investment, FAM 8"
        />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content="Create New Land - FAM 8 Admin" />
        <meta
          property="og:description"
          content="Create a new land for agricultural investments in FAM 8."
        />
        <meta property="og:type" content="website" />
      </Head>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4" aria-label="Create New Land">
          Create New Land
        </h1>
        <LandForm locations={locations} />
      </div>
    </>
  );
}
