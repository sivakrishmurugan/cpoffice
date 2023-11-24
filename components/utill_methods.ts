import * as cookie from 'cookie';

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
    if(acceptZero && (numberValue == 0 || value == undefined)) return '0.00';
    return numberValue == 0 || value == undefined ? '' : removeTrailingZero ? numberValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : numberValue.toFixed(2).replace(regex, '$&,');
}

export const getRecentYears = (count: number = 3, ignoreCurrentYear: boolean = false) => {
    const currentYear = new Date().getFullYear();
    const recentYears = [...Array(count).keys()].reverse().map(e => ignoreCurrentYear ? currentYear - e - 1 : currentYear - e).map(String);
    return recentYears;
}

export const formatDateToDdMmYyyy = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

export const formatDdMmYyyyToYyyyMmDd = (dateString: string) => {
    return dateString.split('-').reverse().join('-')
}

export const getDateAfter365Days = (fromDate: string) => {
    // Parse the input date string into a Date object
    const parts = fromDate.split("-");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is zero-based
    const year = parseInt(parts[2], 10);
  
    const givenDate = new Date(year, month, day);
  
    // Add 365 days to the given date
    givenDate.setDate(givenDate.getDate() + 365);
  
    // Return the date after 365 days
    return formatDateToDdMmYyyy(givenDate);
}