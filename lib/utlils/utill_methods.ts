import * as cookie from 'cookie';
import { ClinicData, Coverage } from '../types';
import { PROTECTION_AND_LIABILITY_COVERAGE } from '../app/app_constants';
import { CoverageResData } from '../hooks/use_sessionstorage';

export const getAuthTokenFromCookie = (cookies: string | undefined) => {
    const authToken = cookie.parse(cookies ?? "")['authToken'];
    return authToken ?? ""
}

export const setAuthToken = (token: string) => {
    document.cookie = cookie.serialize('authToken', token);
}

export const getNumberFromString = (text: string, isInt: boolean = false) => {
    var regex = /[+-]?\d+(\.\d+)?/g;
    let value: RegExpMatchArray | null | number = text.match(regex);
    if(value && value.length > 0) { 
        let temp = '';
        value.forEach(e => temp += e);
        if(isInt) return parseInt(temp);
        return parseFloat(temp);
    } else {
        return null;
    }
}

export const getNumberStringFromString = (text: string) => {
    var regex = /[+-]?\d+(\.\d+)?/g;
    let value: RegExpMatchArray | null | string = text.match(regex);
    if(value && value.length > 0) { 
        let temp = '';
        value.forEach(e => temp += e);
        return temp;
    } else {
        return '';
    }
}

export const removeLeadingZeros = (number: number | string) =>  {
    return number.toString().replace(/\.00$/,'');;
}
  

export const convertToPriceFormat = (value: number | string | null | undefined, acceptZero: boolean = false, removeTrailingZero: boolean = false) => {
    const numberValue = Number(value);
    const regex = /\d(?=(\d{3})+\.)/g;
    if(acceptZero && (numberValue == 0 || value == undefined)) return removeTrailingZero ? '0' : '0.00';
    return numberValue == 0 || value == undefined ? '' : removeTrailingZero ? numberValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : numberValue.toFixed(2).replace(regex, '$&,');
}

export const getRecentYears = (count: number = 3, ignoreCurrentYear: boolean = false) => {
    const currentYear = new Date().getFullYear();
    const recentYears = [...Array(count).keys()].reverse().map(e => ignoreCurrentYear ? currentYear - e - 1 : currentYear - e).map(String);
    return recentYears;
}

export const formatDateToYyyyMmDd = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
}

export const getDateAfter365Days = (fromDate: string) => {
    // Parse the input date string into a Date object
    const parts = fromDate.split("-");
    const day = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is zero-based
    const year = parseInt(parts[0], 10);
  
    const givenDate = new Date(year, month, day);
  
    // Add 365 days to the given date
    givenDate.setDate(givenDate.getDate() + 365);
  
    // Return the date after 365 days
    return formatDateToYyyyMmDd(givenDate);
}

export const convertCoveragesResDataToLocalStateData = (apiRes: any): CoverageResData => {
    return {
        coverages: apiRes.filter((e: Coverage) => e.isOptional != 1),
        optionalCoverages: apiRes.filter((e: Coverage) => e.isOptional == 1),
    }
}

export const convertClinicQuoteResDataToLocalStateData = (apiRes: any, encryptedQuoteId: string): ClinicData => {
    return {
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
        promoCodePercentage: apiRes?.PromoPercentage ?? 0,
        insStartDate: apiRes?.InsuranceStartDate != null ? apiRes?.InsuranceStartDate.slice(0, 10) : null,
        claimDeclaration: {
            previouslyClaimed: apiRes?.ClaimDeclration == null ? null : apiRes?.ClaimDeclration != 0,
            addtionalInfo: (apiRes?.Declarations ?? []).map((e: any) => ({
                type: e?.ClaimType ?? 'Property',
                year: e.ClaimYear ?? 2022,
                amount: e.ClaimAmount ?? 0,
                description: e.Description ?? ''
            }))
        },
        paymentApproved: apiRes?.PaymentApproved == 1,
        isPaid: apiRes?.isPaid == 1
    }
}

export const getRedirectRouteBasedOnQuote = (quote: ClinicData) => {
    if(quote == null) return '/';

    if(quote.isPaid) return '/';

    if(quote.paymentApproved) return '/pay'

    if(quote.selectedCoverages.length < 1 || quote.selectedCoverages.some(e => e.field_1 == 0 || e.field_1 == undefined)) {
        return '/coverage'
    }

    if(quote.selectedCoverages.length > 0 && quote.selectedCoverages.find(e => e.id == 1005) == null && quote.selectedInsType == null) {
        return '/debris'
    }

    if(quote.selectedInsType == null) {
        return '/insurance_type'
    }

    if(quote.selectedOptionalCoverages.length < 1 && quote.insStartDate == null) {
        return '/optional_coverage'
    }

    if(quote.selectedOptionalCoverages.length > 0 && quote.selectedOptionalCoverages.find(e => e.id == PROTECTION_AND_LIABILITY_COVERAGE.id) == null && quote.insStartDate == null) {
        return '/protection_liability_coverage'
    }
    
    if(quote.insStartDate == null) {
        return '/summary'
    }

    return '/claim_declaration';
}