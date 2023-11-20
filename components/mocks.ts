import { Coverage, OptionalCoverage } from "./types"

export const coveragesData: {
    coverages: Coverage[],
    optionalCoverages: OptionalCoverage[],
} = {
    coverages: [
        {
            id: 'BUILDING',
            name: 'Building',
            icon: '/icons/building-icon.svg',
            floorLevel: 10,
            includes: [
                'The building reconstruction/rebuild cost',
                'Appurtenances, plumbing, electrical, writing and installation',
                'Metal-smoke stacks, awnings, blinds, signages, gates, fences, outbuildings.',
                "Architects, Surveyors and Consultant's Fees"
            ],
            excludes: [
                'Building foundation'
            ],
            fields: {
                field_1: {
                    label: 'Sum Insured',
                    note: ''
                },
                field_2: {
                    label: "Architects, Surveyors and Consultant's Fees (Optional)",
                    note: ''
                }
            },
            fireInsPremiumPercentage: 30,
            fireAndPerilsInsPremiumPercentage: 40
        },
        {
            id: 'STOCK_IN_TRADE',
            name: 'Stock-in-Trade',
            icon: '/icons/icon-Stock-in-Trade.svg',
            floorLevel: 10,
            includes: ['Stocks of drugs & Medicine'],
            excludes: [],
            fields: {
                field_1: {
                    label: 'Sum Insured',
                    note: ''
                }
            },
            fireInsPremiumPercentage: 30,
            fireAndPerilsInsPremiumPercentage: 40
        },
        {
            id: 'PLANT_AND_MACHINERY',
            name: 'Plant & Machinery',
            icon: '/icons/Plant-Machinery-icon.svg',
            floorLevel: 10,
            includes: [
                'Office Equipments',
                'Medical Equipments',
                'Clinical Equipments',
                "Laboratoty Equipments",
                'Tools of Trade'
            ],
            excludes: [],
            fields: {
                field_1: {
                    label: 'Sum Insured',
                    note: ''
                }
            },
            fireInsPremiumPercentage: 30,
            fireAndPerilsInsPremiumPercentage: 40
        },
        {
            id: 'FURNITURES_FIXTURES_FITTINGS_RENOVATION_AND_CONTENTS',
            name: 'Furniture, Fixtures, Fittings, Renovation & contents',
            icon: '/icons/intier-icon.svg',
            floorLevel: 10,
            includes: [
                'Furniture',
                'Fixtures',
                'Fittings',
                'Renovation',
                'Air-Conditioning',
                'All Other Contents of Every Description (Sundries/Stationery/Miscellaneous)',
            ],
            excludes: [],
            fields: {
                field_1: {
                    label: 'Sum Insured',
                    note: ''
                }
            },
            fireInsPremiumPercentage: 30,
            fireAndPerilsInsPremiumPercentage: 40
        },
        {
            id: 'REMOVAL_OF_DEBRIS',
            name: 'Removal of Debris',
            icon: '/icons/debris-icon.svg',
            floorLevel: 10,
            includes: [
                'Building',
                'Stock-in-Trade',
                'Plant & Machinery',
                'Furniture, Fixtures, Fittings, Renovation & contents',
            ],
            excludes: [],
            fields: {
                field_1: {
                    label: 'Sum Insured',
                    note: 'Recommended Limit: 10% of the total sum insured/ RM 2,000,000 in aggregate in any one loss whichever is lower'
                }
            },
            fireInsPremiumPercentage: 30,
            fireAndPerilsInsPremiumPercentage: 40
        },
    ],
    optionalCoverages: [
        {
            id: 'PROTECT_AGAINST_LOSS_OF_REVENUE',
            name: 'Protect against Loss of Revenue',
            icon: '/icons/icon-revenue.svg',
            includes: [
                'Loss of Revenue due to Fire &/ selected Perils',
                '12 months Indemnity Period'
            ],
            fields: {
                field_1: {
                    label: 'Gross revenue',
                    note: ''
                },
                field_2: {
                    label: 'Auditor fees (optional)',
                    note: ''
                }
            },
            isABR: false,
            premiumPercentage: 55
        },
        {
            id: 'PROTECT_YOUR_MOBILE_DEVICES',
            name: 'Protect your Mobile devices',
            icon: '/icons/icon-mobile-devices.svg',
            includes: [
                'Mobile/PDA',
                'Laptop/Notebooks'
            ],
            fields: {
                field_1: {
                    label: 'Gross revenue',
                    note: ''
                }
            },
            isABR: false,
            premiumPercentage: 35
        }
    ]
}