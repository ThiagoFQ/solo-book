"use client";

import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageUploadProps {
  value: string;
  onChange: (src: string) => void;
  disabled?: boolean;
  width?: string;
  height?: string;
}

const ImageUpload = ({
  value,
  onChange,
  disabled,
  width = "100%",
  height = "250px",
}: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-4 w-full flex flex-col">
      <CldUploadButton
        onUpload={(result: any) => onChange(result.info.secure_url)}
        options={{
          maxFiles: 1,
        }}
        uploadPreset="ar9j09f1"
      >
        <div
          className="
            p-4
            border-4
            border-primary/10
            rounded-lg
            hover:opacity-75
            transition
            flex
            items-center
            justify-center
            space-y-2
            "
          style={{ width, height }}
        >
          <div className="relative w-full h-full">
            <Image
              fill
              alt="Upload"
              src={value || "/placeholder.svg"}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </CldUploadButton>
    </div>
  );
};

export default ImageUpload;
