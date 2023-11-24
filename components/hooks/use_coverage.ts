"use client"
import { useEffect, useState } from 'react';
import useSessionStorage from './use_sessionstorage';
import axiosClient from '../axios';
import { setAuthToken } from '../utill_methods';
import { coveragesData } from '../mocks';
import { Coverage } from '../types';
import useLocalStorage from './use_localstorage';

const useCoverage = (quoteId?: string) => {
  const [localData, setLocalData] = useLocalStorage('clinic_form_data', null);
  const [coverageSessionData, setCoverageSessionData] = useSessionStorage('coverages', null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if(quoteId && coverageSessionData == null) {
      getData(quoteId);
    }
  }, [coverageSessionData, quoteId])

  const getData = async (quoteID: string) => {
    setLoading(true);
    const quote = await getQuote(quoteID);
    if(quote) {
      setAuthToken(quote.authToken);
      const coverage = await getCoverage(quoteID);
      if(coverage && coverage.success == 1) {
        setCoverageSessionData({
          coverages: coverage.data.filter((e: Coverage) => e.isOptional != 1),
          optionalCoverages: coverage.data.filter((e: Coverage) => e.isOptional == 1),
        })
        // setCoverageSessionData({
        //   coverages: coveragesData.filter(e => e.isOptional != 1),
        //   optionalCoverages: coveragesData.filter(e => e.isOptional == 1),
        // })
      }
    }
    setLoading(false);
  }

  const getQuote = async (quoteID: string) => {
    try {
      const res = await axiosClient.post('/api/clinicshield/getquote', { QuoteID: quoteID });
      if(res && res.data && res.data[0] && res.data[0].Success == 1) {
        setQuoteDataToLocalStorage(res.data[0], quoteID)
        return res.data[0];
      }
    } catch(e) {}
    return null;
  }

  const getCoverage = async (quoteID: string) => {
    try {
      const res = await axiosClient.post('/api/clinicshield/getcoverage', { QuoteID: quoteID });
      if(res && res.data && res.data) {
        return res.data;
      }
    } catch(e) {}
    return null;
  }

  const setQuoteDataToLocalStorage = (apiRes: any, encryptedQuoteId: string) => {
    setLocalData({
      quoteId: encryptedQuoteId,
      basic: {
        name: apiRes.ClinicName,
        number: apiRes.ClinicNumber,
        floorLevel: apiRes.FloorLevel,
        constructionType: apiRes.CType,
        address: apiRes.ClinicAddress,
        mobile: apiRes.Phone,
        email: apiRes.Email,
      },
      selectedCoverages: apiRes?.Coverage ?? [],
      selectedOptionalCoverages: apiRes?.OptionalCoverage ?? [],
      selectedInsType: apiRes?.InsuranceType,
      promoCode: apiRes?.PromoCode,
      insStartDate: apiRes?.InsuranceStartDate,
      claimDeclaration: {
          previouslyClaimed: apiRes?.ClaimDeclration != 0 && apiRes?.ClaimDeclration != null,
          addtionalInfo: apiRes?.Declarations ?? []
      }
    })
  }

  return { isLoading, coveragesData: coverageSessionData, updateDataWithNewQuoteId: getData }
};

export default useCoverage;