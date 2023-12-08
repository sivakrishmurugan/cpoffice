export const API_BASE_URL = 'https://d8xgrpgzteoa309bkryz.doctor.insure';

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
export const APP_WIDTH = ['100%', '90%', '90%', '100%', '100%'];

export const FLOOR_LEVEL = [
    { id: 'LG', value: 'LG' },
    { id: 'G', value: 'G' },
    ...([...Array(100).keys()]).map(e => ({ id: (e + 1).toString(), value: (e + 1).toString() }))
]

export const CONSTRUCTION_TYPES = [
    { id: '1A', value: 'Brick Walls with Non-Combustible Roof' },
    { id: '1B', value: 'Partial Brick Walls, Partial Non-Combustible Roof' },
]

export const FAQ_LIST = [
    {
        question: "What types of damages does the Fire coverage under the FlexiGuard Plus policy protect against?",
        answer: "The Fire coverage protects against loss of or damage to insured buildings, renovations, furniture, fixtures, fittings, machinery, equipment, and stocks-in-trade due to fire or lightning."
    },
    {
        question: "How does the Consequential Loss coverage benefit my clinic in the event of a disaster?",
        answer: "This coverage compensates for loss of profits due to reduced turnover and increased cost of working caused by fire, lightning, and explosion, helping your clinic to maintain financial stability during recovery."
    },
    {
        question: "What is covered under the All Risks insurance in this policy?",
        answer: "The All Risks coverage includes protection for equipment, plant, and machinery in the event of loss or damage from accidental external causes, unless specifically excluded under the policy."
    },
    {
        question: "What does the Burglary insurance cover in the FlexiGuard Plus policy?",
        answer: "The Burglary insurance protects your goods and all properties that are properly locked and secured in your insured premises against burglary or robbery with forcible entry."
    },
    {
        question: "How does the Money coverage safeguard my clinic's finances?",
        answer: "This coverage insures your cash, bank and currency notes, cheques, and money orders against burglary or robbery while in transit and in your insured premises during and after business hours."
    },
    {
        question: "What does the Plate Glass insurance cover?",
        answer: "The Plate Glass insurance covers your signage and glass panels against accidental breakage."
    },
    {
        question: "Can you explain the Public Liability coverage in this policy?",
        answer: "Public Liability coverage protects against third-party claims resulting from bodily injury or property damage occurring at your premises."
    },
    {
        question: "What is Employer’s Liability insurance and why is it important for my clinic?",
        answer: "Employer’s Liability insurance covers liabilities in the event of bodily injury sustained by employees due to work-related accidents or disease, essential for protecting both your employees and your clinic."
    },
    {
        question: "What does the Fidelity Guarantee in this policy cover?",
        answer: "The Fidelity Guarantee insures against loss of money and/or property due to fraud or acts of dishonesty by your employees."
    },
    {
        question: "What are the benefits of the Group Personal Accident coverage in this policy?",
        answer: "This coverage insures against accidental bodily injury which results in death or disablement, providing essential protection for you and your employees."
    }
]

export const MIN_COVERAGE_PREMIUM = 75.00;
export const MAX_COVERAGE_VALUE = 10000000;
export const DEFAULT_FIRE_INS_PERCENTAGE = .1;
export const DEFAULT_FIRE_PERILS_INS_PERCENTAGE = .2;

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

export const TAX_PERCENTAGE = 6;
export const STAMP_DUTY = 10.00;

export const TYPE_OF_CLAIM = [
    { id: 'Property', value: 'Property' },
    { id: 'Consequential Loss', value: 'Consequential Loss' },
    { id: 'Other', value: 'Other' }
]

export const PROTECTION_AND_LIABILITY_COVERAGE = {
    id: 3001,
    icon: '/icons/icon-protection.svg',
    name: 'Protection and Liability Coverage',
    premuimAmount: 405,
    coverageValue: 1000000,
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
            title: 'Plate glass RM 10,000 ',
            contents: ['On Glass and signage']
        },
        {
            title: 'Public liability RM 1,000,000 ',
            contents: ['Limit of Liability during the Period of Insurance']
        },
        {
            title: 'Employer liability RM 250,000 ',
            contents: ['Limit of Liability any one claim or series of claims arising out of one event irrespective of the number of claims that may arise therefrom and during any one Period of Insurance']
        }
    ]
}

export const TOOLTIP_INFO = {
    fireAndPerilsIns: {
        title: 'Protection from fire and listed perils',
        contents: [
            'Storm,',
            'Tempest,',
            'Flood,',
            'Bursting or Overflowing of water tanks,',
            'Explosion - Non-industrial without Boilers,',
            'Earthquake & Volcanic Eruption',
            "Impact Damage (including insured's own vehicles),",
            "Riot Strike and Malicious Damage (Non-Residential),",
            "Sprinkler Leakage Building and contents",
            "Electrical installations clause (Applicable for Plant & Machinery only)"
        ]
    },
    excess: {
        title: '',
        content: 'The first amount of loss that has to be burne by the Policyholder. Insurer will deduct this amount from the total claim and pay the remaining amount.'
    }
}
