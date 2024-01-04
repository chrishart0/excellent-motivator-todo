"use client";
import { useState } from "react";
import Sidebar from "@/components/SideBar";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Sidebar isOpen={isOpen} toggleDrawer={toggleDrawer} />
    </>
  );
};

export default Navigation;