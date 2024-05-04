"use client";
import React from "react";
import { Box } from "@mui/material";
import { Image as SanityImage } from "sanity";
import SanityPicture from "@/components/sanityPicture";

type FullScreenPictureProps = {
  sanityImage?: SanityImage;
};

function FullScreenPicture({ sanityImage }: FullScreenPictureProps) {
  return (
    <>
      {sanityImage && (
        <SanityPicture
          sanityImage={sanityImage}
          alt="Background Image"
          objectFit={"cover"}
          layout={"fill"}
        />
      )}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)",
        }}
      />
    </>
  );
}

export default FullScreenPicture;
