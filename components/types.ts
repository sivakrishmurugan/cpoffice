
/* Coverage api data - starts */
export interface Coverage {
    id: string,
    name: string,
    icon: string,
    floorLevel: number,
    includes: string[],
    excludes: string[],
    fields: {
        field_1: {
            label: string,
            note: string,
        },
        field_2?: {
            label: string | null,
            note: string,
        }
    }
    fireInsPremiumPercentage: number,
    fireAndPerilsInsPremiumPercentage: number
}

export interface OptionalCoverage {
    id: string,
    name: string,
    icon: string,
    includes: string[],
    fields: {
        field_1: {
            label: string,
            note: string,
        },
        field_2?: {
            label: string | null,
            note: string,
        }
    },
    isABR: boolean,
    premiumPercentage: number
}

/* Coverage api data - ends */

export interface NecessaryBasicInfo {
    name: string,
    number: string,
    address: string,
    floorLevel: number,
    constructionType: string,
    email: string,
    mobile: number
}

export interface SelectedCoverage {
    id: string,
    field_1?: number,
    field_2?: number,
}

export interface ClaimDeclarationAdditionalData {
    type: string,
    year: string,
    amount: number,
    description: string
}

export type InsuranceType = null | 'FIRE' | 'FIRE_PERILS';

// Data for final submit
export interface ClinicData {
    basic: NecessaryBasicInfo,
    selectedCoverages: SelectedCoverage[],
    selectedInsType: null | 'FIRE' | 'FIRE_PERILS',
    selectedOptionalCoverages: SelectedCoverage[],
    promoCode: string,
    insStartDate: string,
    claimDeclaration: {
        previouslyClaimed: boolean,
        addtionalInfo: ClaimDeclarationAdditionalData[]
    }
}