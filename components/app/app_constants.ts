export const APP_BG_COLOR = '#f6f5f5';
export const APP_PRIMARY_COLOR = '#132766';
export const APP_SECONDARY_COLOR = '#08a5b5';
export const APP_TEXT_COLOR = 'rgba(4, 4, 49, .8)';
export const APP_GREEN_COLOR = '#00b67a';
export const APP_MEDIUM_VIOLET_COLOR = '#4c5a6f';
export const APP_DARK_VIOLET_COLOR = '#040431';
export const APP_GRAY_COLOR = '#666';
export const APP_YELLOW_COLOR = '#f6b900';
export const APP_BORDER_COLOR = '#d1d1d1';

export const APP_MAX_WIDTH = ['100%', '100%', '1378px', '1378px', '1378px'];
export const APP_WIDTH = ['initial', '90%', '90%', '100%', '100%'];

export const CONSTRUCTION_TYPES = [
    { id: '1A', value: 'Brick Walls with Non-Combustible Roof' },
    { id: '1B', value: 'Partial Brick Walls, Partial Non-Combustible Roof' },
]

export const EXCESS = [
    {
        title: 'Storm, Tempest',
        value: '1% of Total Sum Insured Or RM 200 Whichever is less'
    },
    {
        title: 'Flood',
        value: '1% of Total Sum Insured Or RM 2,500 Whichever is less'
    },
    {
        title: "Impact Damage (Including Insured's Own Vehicles)",
        value: 'RM 250.00 Each And Every Claim'
    },
    {
        title: 'Bursting or Overflowing Of Water Tanks, Apparatus Or Pipes',
        value: 'First RM 1,000 for each and every loss for each separate premises. For sums insured less than RM 50,000 1 % of sum insured sub ject to a minimum of RM100.'
    }
]

export const TYPE_OF_CLAIM = [
    { id: 'PROPERTY', value: 'Property' },
    { id: 'LIABILITY', value: 'Liability' },
    { id: 'CONSEQUENTIAL_LOSS', value: 'Consequential Loss' },
    { id: 'OTHER', value: 'Other' }
]

export const PROTECTION_AND_LIABILITY_COVERAGE = {
    id: 'PROTECTION_AND_LIABILITY_COVERAGE',
    icon: '/icons/icon-protection.svg',
    name: 'Protection and Liability Coverage',
    premuimAmount: 405,
    premiumLabel: 'Protection from a broad range of risks, theft, vandalism, accidental damage, and more',
    contents: [
        {
            title: 'Burglary RM 20,000',
            contents: ['Cover Items in Section A - Fire']
        },
        {
            title: 'Money',
            contents: [
                'On Money Inside premises RM 5,000',
                'During and after business hours kept in locked Safe or Strong Room, Locked Drawers/Cabinets, Cash Registers.',
                'On Money In transit RM 5,000\nOutside premises (from premises to bank or contract sites or vice versa) '
            ]
        },
        {
            title: 'Fidelity guarantee RM 10,000 ',
            contents: ['Amount of Guarantee (in aggregate for all employee)']
        },
        {
            title: 'Plate glass MYR 10,000 ',
            contents: ['On Glass and signage']
        },
        {
            title: 'Public liability MYR 1,000,000 ',
            contents: ['Limit of Liability during the Period of Insurance']
        },
        {
            title: 'Employer liability MYR 250,000 ',
            contents: ['Limit of Liability any one claim or series of claims arising out of one event irrespective of the number of claims that may arise therefrom and during any one Period of Insurance']
        }
    ]
}

export const TOOLTIP_INFO = {
    fireAndPerilsIns: {
        title: 'Protection from fire and listed perils',
        contents: [
            'Strom,',
            'Tempest,',
            'Flood,',
            'Bursting or Overflowing of water tanks,',
            'Explosion - Non-industrial without Boilers,',
            'Earthquake & Volcanic Eruption',
            "impact Damage (including insured's own vehicles),",
            "Riot Strike and Malicious Damage (Non-Residential),",
            "Sprinkler Leakage Building and contents",
            "Electical installations clause (Applicable for Plant & Machinery only)"
        ]
    },
    excess: {
        title: '',
        content: 'The first amount of loss that has to be burne by the Policyholder. Insurer will deduct this amount from the total claim and pay the remaining amount.'
    }
}
