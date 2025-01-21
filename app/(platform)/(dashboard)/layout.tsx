import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "./_components/Navbar";

const DashBoardLayout = ({ 
  children }: { 
    children: React.ReactNode 
}) => {
  return (
    <div>
      <Toaster />
      <Navbar />
      {children}
    </div>
  );
};

export default DashBoardLayout;