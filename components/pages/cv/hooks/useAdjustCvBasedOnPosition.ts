import {
  CvUpgradeParams,
  CvUpgradeResponse,
} from '@/app/api/personalize-cv/route'
import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'
import { useCallback } from 'react'

interface AdjustCvBasedOnPositionProps {
  cvProps: CVSettings
  positionDetails: string | null
  positionSummary?: string | null

  setLoading: (loading: boolean) => void
  setsnackbarMessage: (message: string) => void
  updateCvInRedux: (cvSettings: CVSettings) => void
  setPositionSummary: (positionSummary: string) => void
  setCompanyName: (companyName: string) => void
}

export const useAdjustCvBasedOnPosition = ({
  cvProps,
  positionDetails,
  positionSummary,
  setLoading,
  setsnackbarMessage,
  updateCvInRedux,
  setPositionSummary,
  setCompanyName,
}: AdjustCvBasedOnPositionProps) => {
  const adjustCvBasedOnPosition = useCallback(async () => {
    setLoading(true)

    const cvUpgradeParams: CvUpgradeParams = {
      cvBody: cvProps,
      positionWeAreApplyingFor: positionDetails ?? undefined,
      positionSummary: positionSummary ?? undefined,
    }

    try {
      const res = await fetch('/api/personalize-cv', {
        method: 'POST',
        body: JSON.stringify(cvUpgradeParams),
      })

      const transformedCv: CvUpgradeResponse = await res.json()
      const { cv, newPositionSummary, companyName } = transformedCv
      if (cv) updateCvInRedux(cv)
      if (!positionSummary && newPositionSummary) {
        setPositionSummary(newPositionSummary)
      }
      if (companyName) setCompanyName(companyName)
      setsnackbarMessage('CV transformed')
    } catch (err: any) {
      setsnackbarMessage('Error transforming CV: ' + err.message)
    }

    setLoading(false)
  }, [
    setLoading,
    setsnackbarMessage,
    updateCvInRedux,
    setPositionSummary,
    setCompanyName,
  ])

  return { adjustCvBasedOnPosition }
}
