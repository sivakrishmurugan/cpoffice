"use client"
import { useEffect, useState } from 'react';
import useSessionStorage, { CoverageResData } from './use_sessionstorage';
import axiosClient from '../axios';
import { convertClinicQuoteResDataToLocalStateData, convertCoveragesResDataToLocalStateData, setAuthToken } from '../utill_methods';
import { coveragesData } from '../mocks';
import { ClinicData, Coverage } from '../types';
import useLocalStorage from './use_localstorage';

const useCoverage = (quoteId?: string | null) => {
  const [localData, setLocalData] = useSessionStorage<ClinicData | null>('clinic_form_data', null);
  const [coverageSessionData, setCoverageSessionData] = useSessionStorage<CoverageResData | null>('coverages', null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if(quoteId && coverageSessionData == null) {
      getData(quoteId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coverageSessionData, quoteId])

  const getData = async (quoteID: string) => {
    setLoading(true);
    const quote = await getQuote(quoteID);
    if(quote) {
      setAuthToken(quote.authToken);
      const coverage = await getCoverage(quoteID);
      if(coverage && coverage.success == 1) {
        setCoverageSessionData(convertCoveragesResDataToLocalStateData(coverage.data))
      }
    }
    setLoading(false);
  }

  const getQuote = async (quoteID: string) => {
    try {
      const res = await axiosClient.post('/api/clinicshield/getquote', { QuoteID: quoteID }, { headers: { secretkey: process.env.NEXT_PUBLIC_API_SECRET_KEY } });
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
    setLocalData(convertClinicQuoteResDataToLocalStateData(apiRes, encryptedQuoteId))
  }

  const updateDataWithNewQuoteAndCoverages = (quote: any, coverages: any, encryptedQuoteId: string) => {
    const convertedQuoteData = convertClinicQuoteResDataToLocalStateData(quote, encryptedQuoteId);
    const convertedCoveragesData = convertCoveragesResDataToLocalStateData(coverages);
    setAuthToken(quote.authToken);
    setLocalData(convertedQuoteData);
    setCoverageSessionData(convertedCoveragesData);
    return { convertedQuoteData, convertedCoveragesData };
  }

  return { isLoading, coveragesData: coverageSessionData, updateDataWithNewQuoteId: getData, updateDataWithNewQuoteAndCoverages }
};

export default useCoverage;