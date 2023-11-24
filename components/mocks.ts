import { Coverage } from "./types"

export const coveragesData: Coverage[] = [
        {
            CoverageID: 'BUILDING',
            CoverageName: 'Building',
            ImageName: 'building.svg',
            Includes: {
                "Coverage includes": [
                    'The building reconstruction/rebuild cost',
                    'Appurtenances, plumbing, electrical, writing and installation',
                    'Metal-smoke stacks, awnings, blinds, signages, gates, fences, outbuildings.',
                    "Architects, Surveyors and Consultant's Fees"
                ]
            },
            Excludes: {
                "Coverage excludes": [
                    'Building foundation'
                ]
            },
            CoverageFields: {
                field_1: {
                    label: 'Sum Insured',
                    note: ''
                },
                field_2: {
                    label: "Architects, Surveyors and Consultant's Fees (Optional)",
                    note: ''
                }
            },
            Fireinsurance: 30,
            FirePerlis: 40,
            InsPercent: 0,
            IsABR: 0,
            PageOrder: "1",
            isOptional: 0,
        },
        {
            CoverageID: 'STOCK_IN_TRADE',
            CoverageName: 'Stock-in-Trade',
            ImageName: 'stockintrade.svg',
            Includes: {
                "Coverage includes": ['Stocks of drugs & Medicine']
            },
            Excludes: {
                "Coverage excludes": []
            },
            CoverageFields: {
                field_1: {
                    label: 'Sum Insured',
                    note: ''
                }
            },
            Fireinsurance: 30,
            FirePerlis: 40,
            InsPercent: 0,
            IsABR: 0,
            PageOrder: "1",
            isOptional: 0,
        },
        {
            CoverageID: 'PLANT_AND_MACHINERY',
            CoverageName: 'Plant & Machinery',
            ImageName: 'plantmachinery.svg',
            Includes: {
                "Coverage includes": [
                    'Office Equipments',
                    'Medical Equipments',
                    'Clinical Equipments',
                    "Laboratoty Equipments",
                    'Tools of Trade'
                ]
            },
            Excludes: {
                "Coverage excludes": []
            },
            CoverageFields: {
                field_1: {
                    label: 'Sum Insured',
                    note: ''
                }
            },
            Fireinsurance: 30,
            FirePerlis: 40,
            InsPercent: 0,
            IsABR: 0,
            PageOrder: "1",
            isOptional: 0,
        },
        {
            CoverageID: 'FURNITURES_FIXTURES_FITTINGS_RENOVATION_AND_CONTENTS',
            CoverageName: 'Furniture, Fixtures, Fittings, Renovation & contents',
            ImageName: 'furniture.svg',
            Includes: {
                "Coverage includes": [
                    'Furniture',
                    'Fixtures',
                    'Fittings',
                    'Renovation',
                    'Air-Conditioning',
                    'All Other Contents of Every Description (Sundries/Stationery/Miscellaneous)',
                ]
            },
            Excludes: {
                "Coverage excludes": []
            },
            CoverageFields: {
                field_1: {
                    label: 'Sum Insured',
                    note: ''
                }
            },
            Fireinsurance: 30,
            FirePerlis: 40,
            InsPercent: 0,
            IsABR: 0,
            PageOrder: "1",
            isOptional: 0,
        },
        {
            CoverageID: 'REMOVAL_OF_DEBRIS',
            CoverageName: 'Removal of Debris',
            ImageName: 'removal.svg',
            Includes: {
                "Coverage includes": [
                    'Building',
                    'Stock-in-Trade',
                    'Plant & Machinery',
                    'Furniture, Fixtures, Fittings, Renovation & contents',
                ]
            },
            Excludes: {
                "Coverage excludes": []
            },
            CoverageFields: {
                field_1: {
                    label: 'Sum Insured',
                    note: 'Recommended Limit: 10% of the total sum insured/ RM 2,000,000 in aggregate in any one loss whichever is lower'
                }
            },
            Fireinsurance: 30,
            FirePerlis: 40,
            InsPercent: 0,
            IsABR: 0,
            PageOrder: "2",
            isOptional: 0,
        },
        {
            CoverageID: 'PROTECT_AGAINST_LOSS_OF_REVENUE',
            CoverageName: 'Protect against Loss of Revenue',
            ImageName: 'lossrevenue.svg',
            Includes: {
                "Coverage includes": [
                    'Loss of Revenue due to Fire &/ selected Perils',
                    '12 months Indemnity Period'
                ]
            },
            Excludes: {
                "Coverage excludes": []
            },
            CoverageFields: {
                field_1: {
                    label: 'Gross revenue',
                    note: ''
                },
                field_2: {
                    label: 'Auditor fees (optional)',
                    note: ''
                }
            },
            Fireinsurance: 30,
            FirePerlis: 40,
            InsPercent: 0,
            IsABR: 0,
            PageOrder: "2",
            isOptional: 1,
        },
        {
            CoverageID: 'PROTECT_YOUR_MOBILE_DEVICES',
            CoverageName: 'Protect your Mobile devices',
            ImageName: 'mobiledevices.svg',
            Includes: {
                "Coverage includes": [
                    'Mobile/PDA',
                    'Laptop/Notebooks'
                ]
            },
            Excludes: {
                "Coverage excludes": []
            },
            CoverageFields: {
                field_1: {
                    label: 'Gross revenue',
                    note: ''
                }
            },
            Fireinsurance: 30,
            FirePerlis: 40,
            InsPercent: 0,
            IsABR: 0,
            PageOrder: "2",
            isOptional: 1,
        }
    ];