import React from "react";
import { Avatar, Box, Paper, Typography } from "@mui/material";
import PageWrapper from "@/components/pages/pageWrapper";
import CvSection, { SectionProps } from "@/components/pages/cv/cvSection";
import Grid2 from "@mui/material/Unstable_Grid2";
import Download from "@/components/download";

type CvProps = {
  name: string;
  intro: string;
  picture: string;
  mainSection: SectionProps[];
  sideSection: SectionProps[];
};

function CvPage({ name, intro, picture, sideSection, mainSection }: CvProps) {
  return (
    <PageWrapper title={"CV"}>
      <Download>
        <Grid2 container spacing={2}>
          <Grid2 xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="left">
              <Grid2
                container
                alignItems="left"
                direction="column"
                textAlign="left"
              >
                <Avatar
                  alt={name}
                  src={picture}
                  sx={{ width: 100, height: 100, marginBottom: "15px" }}
                />
                <Typography variant="h4" component="div" gutterBottom>
                  {name}
                </Typography>
                <Typography variant="body1" pb={5}>
                  {intro}
                </Typography>
              </Grid2>
              {sideSection.map((sections, index) => (
                <Box key={index} mb={2}>
                  <CvSection {...sections} />
                </Box>
              ))}
            </Box>
          </Grid2>
          <Grid2 xs={12} md={8} textAlign="left">
            {mainSection.map((section, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <CvSection {...section} />
              </Paper>
            ))}
          </Grid2>
        </Grid2>
      </Download>
    </PageWrapper>
  );
}

export default CvPage;
