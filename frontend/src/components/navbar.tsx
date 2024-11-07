import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onGenerateClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onGenerateClick }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (onGenerateClick) {
      onGenerateClick();
    } else {
      navigate("/", { state: { openDialog: true } });
    }
  };

  return (
    <nav className="flex items-center justify-between py-3 bg-white px-12 w-full shadow">
      <div className="flex items-center cursor-pointer">
        <img src="/favicon.png" alt="Logo" className="h-8 w-8 mr-2" />
        <span className="text-xl font-bold">CloudArch</span>
      </div>
      <div className="flex items-center"></div>
      <Button onClick={handleButtonClick}>Generate Diagram</Button>
    </nav>
  );
};
