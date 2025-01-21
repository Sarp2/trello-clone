import { Suspense } from "react";

import { Info } from "../_components/Info";
import { ActivityList } from "./_components/ActivityList"

const ActivityPage = () => {

  return (
    <div className="w-full">
      <Info />
      <Suspense fallback={<ActivityList.Skeleton />}>
      <ActivityList />
      </Suspense>
    </div>
  );
};

export default ActivityPage;