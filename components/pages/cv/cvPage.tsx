"use client";
import { CvTranslateParams } from "@/app/api/translate-cv/route";
import PageWrapper from "@/components/pages/pageWrapper";
import Print from "@/components/print";
import { CvSection as CvSectionSanitySchemaType } from "@/sanity/schemaTypes/cv/cvSection";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  SnackbarCloseReason,
  TextField
} from "@mui/material";
import { ChatCompletionStream } from "openai/lib/ChatCompletionStream.mjs";
import { useEffect, useState } from "react";
import Cv from "./cv";
import CvLanguageSelectionComponent from "./languageSelect";

const DEV = process.env.NODE_ENV;

export type CvProps = {
  name: string;
  intro: string;
  // picture: string;
  mainSection: CvSectionSanitySchemaType[];
  sideSection?: CvSectionSanitySchemaType[];
};

function CvPage(cvProps: CvProps) {
  const [selectedLanguage, setLanguage] = useState("English");
  const [translatedCv, setTranslatedCv] = useState<CvProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setsnackbarMessage] = useState<string | null>(null);
  const [titleClickedTimes, setTitleClickedTimes] = useState(0);
  const [extraGptInput, setExtraGptInput] = useState("");

  useEffect(() => {
    setsnackbarMessage(null);
    if (selectedLanguage === "English") {
      setTranslatedCv(null);
      return;
    }

    const cvTranslateParams: CvTranslateParams = {
      cvBody: cvProps,
      targetLanguage: selectedLanguage,
      extraGptInput: extraGptInput,
    };

    setLoading(true);
    (async () => {
      try {
        const res = await fetch("/api/translate-cv", {
          method: "POST",
          body: JSON.stringify(cvTranslateParams),
        });
        console.log("res", res);
        const runner = ChatCompletionStream.fromReadableStream(res.body!);

        runner.on("finalChatCompletion", async (completion) => {
          try {
            if (completion.choices[0].message.content) {
              setTranslatedCv(JSON.parse(completion.choices[0].message.content));
            } else {
              setTranslatedCv(null);
            }
          } catch (e) {
            setsnackbarMessage("Error translating CV: " + e);
          }
          setLoading(false);
        });
      } catch (err: any) {
        setLoading(false);
        setLanguage("English");
        setsnackbarMessage("Error translating CV: " + err.message);
      }
    })();
  }, [cvProps, selectedLanguage]);

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
  return (
    <PageWrapper title={"CV"} onTitleClicked={onTitleClicked}>
      <Box sx={{ mb: 5 }}>
        {DEV && (
          <form>
            <CvLanguageSelectionComponent
              selectedLanguage={selectedLanguage}
              handleLanguageChange={handleLanguageChange}
            />
            {(titleClickedTimes >= 5) &&
              <Box sx={{ mt: 2 }}>
                <TextField
                  disabled={loading}
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={extraGptInput}
                  onChange={(e) => setExtraGptInput(e.target.value)}
                />
              </Box>}
            <Button variant="contained" color="primary" type="submit">
              Translate
            </Button>
          </form>
        )}


      </Box>

      <Print fileName={`${cvProps.name}_CV`}>
        {translatedCv ? <Cv {...translatedCv} /> : <Cv {...cvProps} />}
      </Print>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Honestly I'm not sure if this works but I don't want to remove it either. :D */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarMessage !== null}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbarMessage}
        color="error"
      />
    </PageWrapper>
  );
}

export default CvPage;
