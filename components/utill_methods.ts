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
  

export const convertToPriceFormat = (value: number | null | undefined, acceptZero: boolean = false) => {
    const regex = /\d(?=(\d{3})+\.)/g;
    if(acceptZero && (value == 0 || value == undefined)) return '0.00';
    return value == 0 || value == undefined ? '' : value.toFixed(2).replace(regex, '$&,');
}

export const getRecentYears = (count: number = 3, ignoreCurrentYear: boolean = false) => {
    const currentYear = new Date().getFullYear();
    const recentYears = [...Array(count).keys()].reverse().map(e => ignoreCurrentYear ? currentYear - e - 1 : currentYear - e).map(String);
    return recentYears;
}