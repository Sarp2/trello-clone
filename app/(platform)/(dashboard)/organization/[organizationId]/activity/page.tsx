import { Suspense } from "react";

import { Info } from "../_components/Info";
import { ActivityList } from "./_components/ActivityList"
import { checkSubscription } from "@/lib/subscription";

const ActivityPage = async () => {
  const isPro = await checkSubscription();

  return (
    <div className="w-full">
      <Info isPro={isPro}  />
      <Suspense fallback={<ActivityList.Skeleton />}>
      <ActivityList />
      </Suspense>
    </div>
  );
};

export default ActivityPage;