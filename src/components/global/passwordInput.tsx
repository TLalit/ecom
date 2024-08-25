"use client";

import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input, InputProps } from "../ui/input";
export const PasswordInput = (props: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <Input
        endIcon={(props) => (
          <Button variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)}>
            <EyeIcon {...props} />
          </Button>
        )}
        type={showPassword ? "text" : "password"}
        {...props}
      />
    </div>
  );
};
