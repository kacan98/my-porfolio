import React from "react";
import {
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { ConditionalWrapper } from "@/components/conditionalWrapper";
import Link from "next/link";
import { CvSection } from "@/sanity/schemaTypes/cv/cvSection";
import { SUPPORTED_ICONS } from "@/components/icon";

function CvSectionComponent({
  title,
  paragraphs,
  subSections,
  bulletPoints,
  subtitles,
}: CvSection) {
  return (
    <Box textAlign={"left"}>
      {title && (
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
      )}
      {subtitles && (
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="subtitle1">{subtitles.left}</Typography>
          <Typography variant="subtitle1">{subtitles.right}</Typography>
        </Box>
      )}
      {paragraphs &&
        paragraphs.map((paragraph, idx) => (
          <Typography key={idx} variant="body1" gutterBottom>
            {paragraph}
          </Typography>
        ))}
      {bulletPoints &&
        bulletPoints.map((point, idx) => (
          <ListItem key={idx}>
            <ListItemIcon>
              {SUPPORTED_ICONS[point.iconName]?.component()}
            </ListItemIcon>
            <ConditionalWrapper
              condition={!!point.url}
              wrapper={(c) => (
                <Link href={point.url!} target={"_blank"}>
                  {c}
                </Link>
              )}
            >
              <ListItemText primary={point.text} />
            </ConditionalWrapper>
          </ListItem>
        ))}
      {subSections && (
        <>
          {subSections.map((section, index) => (
            <div key={index}>
              <Typography variant="h5" gutterBottom>
                {section.title}
              </Typography>
              {section.subtitles && (
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="subtitle1">
                    {section.subtitles.left}
                  </Typography>
                  <Typography variant="subtitle1">
                    {section.subtitles.right}
                  </Typography>
                </Box>
              )}
              {section.paragraphs &&
                section.paragraphs.map((paragraph, idx) => (
                  <Typography key={idx} variant="body1" gutterBottom>
                    {paragraph}
                  </Typography>
                ))}
            </div>
          ))}
        </>
      )}
    </Box>
  );
}

export default CvSectionComponent;
