import { JobCvIntersectionResponse } from "@/app/api/job-cv-intersection/route";
import {
    Box, Button,
    TextField
} from "@mui/material";
import JudgementSection from "./paper/judgementSection";

export interface AiFormProps {
    judgement: JobCvIntersectionResponse | null;
    checked: string[];
    positionSummary: string;
    positionDetails: string;

    setLoading: (value: boolean) => void;
    setsnackbarMessage: (value: string | null) => void;
    setCompanyName: (value: string) => void;
    handleChecked: (missing: string) => () => void;
    setPositionSummary: (value: string) => void;
    setPositionDetails: (value: string) => void;

    getSummary: () => void;
    getJudgement: () => void;
    adjustCvBasedOnPosition: () => void;
}

export const AiForm = ({
    judgement,
    checked,
    positionSummary,
    positionDetails,
    handleChecked,
    setPositionSummary,
    setPositionDetails,

    getSummary,
    getJudgement,
    adjustCvBasedOnPosition
}: AiFormProps) => {
    return (
        <Box>
            <TextField
                multiline
                maxRows={15}
                label="Enter a job description here"
                variant="outlined"
                fullWidth
                value={positionDetails}
                onChange={(e) => setPositionDetails(e.target.value)}
            />
            {positionDetails && positionDetails.length > 10 && (
                <>
                    <Button
                        type="button"
                        onClick={getSummary}
                        sx={{ mt: 2, width: "100%" }}
                        variant="contained"
                        color="secondary"
                    >
                        Summarize the position
                    </Button>
                    {positionSummary && (
                        <TextField
                            sx={{ mt: 2 }}
                            multiline
                            fullWidth
                            label="Position Summary"
                            variant="outlined"
                            value={positionSummary}
                            onChange={(e) => setPositionSummary(e.target.value)}
                        />
                    )}
                    <Button
                        type="button"
                        onClick={getJudgement}
                        sx={{ mt: 2, width: "100%" }}
                        variant="contained"
                        color="secondary"
                    >
                        Match CV with the position
                    </Button>
                    {judgement && (
                        <JudgementSection
                            judgement={judgement}
                            checked={checked}
                            handleChecked={handleChecked} />
                    )}
                    <Button
                        type="button"
                        onClick={adjustCvBasedOnPosition}
                        sx={{ mt: 2, width: "100%" }}
                        variant="contained"
                        color="primary"
                    >
                        Improve CV (based on the position)
                    </Button>
                </>
            )}
        </Box>
    );
};