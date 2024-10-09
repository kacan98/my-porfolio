"use client";
import { JobCvIntersectionParams, JobCvIntersectionResponse } from "@/app/api/job-cv-intersection/route";
import { PositionSummarizeParams, PositionSummarizeResponse } from "@/app/api/position-summary/route";
import { CvTranslateParams } from "@/app/api/translate/route";
import PageWrapper from "@/components/pages/pageWrapper";
import Print from "@/components/print";
import { useAppSelector } from "@/redux/hooks";
import { initCv } from "@/redux/slices/cv";
import { CvSection as CvSectionSanitySchemaType, CVSettings } from "@/sanity/schemaTypes/singletons/cvSettings";
import CreateIcon from '@mui/icons-material/Create';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  SnackbarCloseReason,
  TextField,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import CvPaper from "./cvPaper";
import CvLanguageSelectionComponent from "./languageSelect";
import { adjustCvBasedOnPosition } from "./hooks/adjustCvBasedOnPosition";

const DEV = process.env.NODE_ENV === "development";

export type CvProps = {
  name: string;
  intro: string;
  // picture: string;
  mainSections: CvSectionSanitySchemaType[];
  sideSections: CvSectionSanitySchemaType[];
};

function CvPage() {
  const reduxCvProps = useAppSelector((state) => state.cv);
  const [selectedLanguage, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setsnackbarMessage] = useState<string | null>(null);
  const [titleClickedTimes, setTitleClickedTimes] = useState(0);
  const editable = titleClickedTimes >= 5 || DEV
  const [positionSummary, setPositionSummary] = useState<string>('')
  const [positionDetails, setPositionDetails] = useState<string>('')
  const [judgement, setJudgement] = useState<JobCvIntersectionResponse | null>(null)
  const [companyName, setCompanyName] = useState<string | null>(null)
  const prettyfiedCompanyName = companyName ? `_${companyName.split(" ").join("_")}` : ''

  const dispatch = useDispatch();
  const updateCvInRedux = (cv: CVSettings) => {
    dispatch(initCv(cv));
  }

  const handleLanguageChange = async (l: any) => {
    setLanguage(l.target.value);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setsnackbarMessage(null);
  };

  const onTitleClicked = () => {
    setTitleClickedTimes(prev => prev + 1);
  }

  const getSummary = async () => {
    if (!positionDetails) return setsnackbarMessage('Please provide position details')

    setLoading(true)

    const positionSummaryParams: PositionSummarizeParams = {
      description: positionDetails
    }

    try {
      const res: PositionSummarizeResponse = await fetch('/api/position-summary', {
        method: 'POST',
        body: JSON.stringify(positionSummaryParams),
      }).then(res => res.json())
      setPositionSummary(res.summary)
      if (res.companyName) setCompanyName(res.companyName)
    } catch (err) {
      setsnackbarMessage('Error summarizing position')
    }
    setLoading(false)
  }

  const getJudgement = async () => {
    if (!positionDetails) return setsnackbarMessage('Please provide position details')
    setLoading(true)
    try {
      const getJudgementParams: JobCvIntersectionParams = {
        candidate: reduxCvProps,
        jobDescription: positionDetails
      }

      const res = await fetch('/api/job-cv-intersection', {
        method: 'POST',
        body: JSON.stringify(getJudgementParams),
      })
      const result = await res.json()
      setJudgement(JSON.parse(result))
    } catch (err) {
      setsnackbarMessage('Error getting a judgement')
    }
    setLoading(false)
  }

  const translateCv = async ({ cvProps, selectedLanguage }: { cvProps: CVSettings; selectedLanguage: string; }) => {
    if (selectedLanguage === 'English') return setsnackbarMessage('Please select a language to translate to')

    setLoading(true)
    try {
      const cvTranslateParams: CvTranslateParams = {
        targetLanguage: selectedLanguage,
        cv: cvProps
      }

      const res = await fetch('/api/translate', {
        method: 'POST',
        body: JSON.stringify(cvTranslateParams),
      })
      const result = await res.json()
      const parsed: CVSettings = JSON.parse(result)
      updateCvInRedux(parsed)
    } catch (err) {
      setsnackbarMessage('Error getting a judgement')
    }
    setLoading(false)
  }

  return (
    <PageWrapper title={"CV"} onTitleClicked={onTitleClicked}>
      {editable && (
        <>
          <Typography variant="h2" mb={2}>
            Now you can edit. <CreateIcon />
          </Typography>
          <Typography variant="body1">
            But be careful. This is possible just to tweak something (or transform with AI) locally on your machine before sending it to potential employers.
            The changes currently won&apos;t be saved in any way. I might add saving in the future.
          </Typography>
        </>
      )}

      <Box sx={{ mb: 5, mt: 2 }}>
        {/* AI did not work in the past in production because of limitations in Vercel :((( */}
        {/* but let's try */}
        {DEV && editable && (
          <>
            {
              <Box>
                <TextField
                  multiline
                  maxRows={15}
                  label="Enter a job description here"
                  variant="outlined"
                  value={positionDetails}
                  onChange={(e) => setPositionDetails(e.target.value)}
                  fullWidth>
                </TextField>
                {
                  positionDetails && (positionDetails.length > 10) && (
                    <>
                      <Button
                        type="button"
                        onClick={() => getSummary()}
                        sx={{ mt: 2, width: "100%" }}
                        variant="contained"
                        color="secondary">
                        Get &quot;Hiring manager&apos;s summary&quot;
                      </Button>
                      {positionSummary && (
                        <TextField
                          sx={{
                            mt: 2
                          }}
                          multiline
                          fullWidth
                          label="Position Summary"
                          variant="outlined"
                          value={positionSummary}
                          onChange={(e) => setPositionSummary(e.target.value)}
                        >
                          {positionSummary}
                        </TextField>
                      )}
                      <Button
                        type="button"
                        onClick={() => getJudgement()}
                        sx={{ mt: 2, width: "100%" }}
                        variant="contained"
                        color="secondary">
                        How well does the candidate fit the position?
                      </Button>
                      {judgement && (
                        <Box>
                          <Typography variant="h6">Judgement : {`${judgement.rating}/10`}</Typography>
                          <Typography variant="body1">
                            {judgement.opinion}
                          </Typography>
                          <Typography variant="h6">Why?</Typography>
                          <Typography variant="body1">
                            {judgement.whatIsGood}
                          </Typography>
                          <Typography variant="h6">What could be better?</Typography>
                          <Typography variant="body1">
                            {judgement.whatIsMissing}
                          </Typography>
                        </Box>
                      )}
                      <Button
                        type="button"
                        onClick={() => adjustCvBasedOnPosition({
                          cvProps: reduxCvProps,
                          setLanguage,
                          setLoading,
                          setsnackbarMessage,
                          updateCvInRedux,
                          positionSummary,
                          positionDetails,
                          setPositionSummary,
                          setCompanyName
                        })} sx={{ mt: 2, width: "100%" }} variant="contained" color="primary">
                        Transform CV by AI, based on the position
                      </Button>
                    </>
                  )
                }
              </Box>
            }
          </>
        )}
      </Box>

      <Print fileName={`${reduxCvProps.name}_CV${prettyfiedCompanyName ?? ''}`}>
        <CvPaper editable={editable} />
      </Print>

      {DEV && (
        <>
          <Box mb={2}>
            <CvLanguageSelectionComponent
              selectedLanguage={selectedLanguage}
              handleLanguageChange={handleLanguageChange}
            />
          </Box>
          <Button
            type="button"
            onClick={() => translateCv({
              cvProps: reduxCvProps,
              selectedLanguage
            })} sx={{ mt: 2, width: "100%" }} variant="outlined" >
            Translate
          </Button>
        </>
      )}

      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: 'flex',
          flexDirection: 'column',
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Discussing with Chat GPT...
        </Typography>
      </Backdrop>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarMessage !== null}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbarMessage}
        color="error"
      />
    </PageWrapper >
  );
}

export default CvPage;
