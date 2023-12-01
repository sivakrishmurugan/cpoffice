
/* Coverage api data - starts */
export interface Coverage {
    CoverageID: string | number,
    CoverageName: string,
    ImageName: string,
    Includes: {
        "Coverage includes": string[]
    },
    Excludes: {
        "Coverage excludes": string[]
    },
    CoverageFields: {
        field_1: {
            label: string,
            note: string,
        },
        field_2?: {
            label: string | null,
            note: string,
        }
    }
    Fireinsurance: number | null,
    FirePerlis: number | null,
    InsPercent: number,
    IsABR: 0 | 1,
    PageOrder: string,
    isOptional: 0 | 1
}

/* Coverage api data - ends */

export interface NecessaryBasicInfo {
    name: string,
    number: string,
    address: string,
    floorLevel: string,
    constructionType: string,
    email: string,
    mobile: number
}

export interface SelectedCoverage {
    id: number | string,
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
    quoteId: string,
    basic: NecessaryBasicInfo,
    selectedCoverages: SelectedCoverage[],
    selectedInsType: null | 'FIRE' | 'FIRE_PERILS',
    selectedOptionalCoverages: SelectedCoverage[],
    promoCode: string,
    promoCodePercentage: null | number,
    insStartDate: string,
    isPaid: boolean,
    paymentApproved: boolean,
    claimDeclaration: {
        previouslyClaimed: boolean | null,
        addtionalInfo: ClaimDeclarationAdditionalData[]
    }
}