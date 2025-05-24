import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export const UserDrawer = () => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return null;
  }

  return (
    <Drawer>
      <DrawerTrigger>
        <User />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Welcome {currentUser.displayName}</DrawerTitle>
          <DrawerDescription>Unbound your overmightyness.</DrawerDescription>
        </DrawerHeader>
        <div className={"px-4 py-6"}>
          <div className={"flex justify-end"}>
            <Button variant={"outline"} onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
