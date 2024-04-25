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
    { id: 'B5', value: 'Upto 5 floors' },
    { id: 'A5', value: 'More than 5 floors' }
  //  ...([...Array(100).keys()]).map(e => ({ id: (e + 1).toString(), value: (e + 1).toString() }))
]

export const CONSTRUCTION_TYPES = [
    { id: '1A', value: 'Brick Walls with Non-Combustible Roof' },
    { id: '1B', value: 'Partial Brick Walls, Partial Non-Combustible Roof' },
]

export const FORM_FIELD_ERROR_MESSAGES = {
    name: {
        required: 'Clinic Name is Required!',
        format: 'Clinic Name should contain only alphabets and less than 200 characters!'
    },
    number: {
        required: 'Clinic Number is Requried!',
        format: 'Clinic Number should contain only alphabets, numbers and should be less than 200 characters!'
    },
    address: {
        required: 'Address is Required!',
        format: 'Address cannot have more than 200 characters!'
    },
    PICName: {
        required: 'Person In Charge Name is Required!',
        format: 'Person In Charge Name should contain only alphabets and less than 200 characters!'
    },
    PICID: {
        required: 'Person In Charge IC is Requried!',
        format: 'Person In Charge IC should contain only alphabets, numbers and should be less than 200 characters!'
    },
    email: {
        required: 'Email is Required!',
        format: 'Invalid Email Format!'
    },
    mobile: {
        required: 'Mobile Number is Required!',
        format: 'Mobile Number must contain only numbers and should be between 7 to 11 digits!'
    }
}

export const FAQ_LIST = [
    {
        question: "What types of damages does the Fire coverage under the DoctorShield Clinic Property Insurance policy protect against?",
        answer: "The Fire coverage protects against loss of or damage to insured buildings, renovations, furniture, fixtures, fittings, machinery, equipment, and stocks-in-trade due to fire or lightning."
    },
    {
        question: "How does the Consequential Loss coverage benefit my clinic in the event of a disaster?",
        answer: "This coverage compensates for loss of profits due to reduced of gross revenue and increased cost of working caused by fire, lightning, and explosion, helping your clinic to maintain financial stability during recovery."
    },
    {
        question: "What is covered under the All Risks insurance in this policy?",
        answer: "The All Risks coverage includes protection for mobile devices in the event of loss or damage from accidental external causes, unless specifically excluded under the policy."
    },
    {
        question: "What does the Burglary insurance cover in the DoctorShield Clinic Property Insurance policy?",
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
    }/*,
    {
        question: "What are the benefits of the Group Personal Accident coverage in this policy?",
        answer: "This coverage insures against accidental bodily injury which results in death or disablement, providing essential protection for you and your employees."
    }*/
]

export const MIN_COVERAGE_PREMIUM = 75.00;
export const MAX_COVERAGE_VALUE = 10000000;
export const MOBILE_MAX_COVERAGE_VALUE = 10000;
export const LAPTOP_MAX_COVERAGE_VALUE = 30000;
export const DEFAULT_FIRE_INS_PERCENTAGE = 0;
export const DEFAULT_FIRE_PERILS_INS_PERCENTAGE = 0;
export const MAX_CONSULTANT_FEE_PERCENTAGE = Number(process.env.NEXT_PUBLIC_MAX_CONSULTANT_FEE_PERCENTAGE ?? 0);
export const MAX_AUDITOR_FEE_PERCENTAGE = Number(process.env.NEXT_PUBLIC_MAX_AUDITOR_FEE_PERCENTAGE ?? 0);
export const CONSULTANT_FEE_REPLACE_TEXT = 'CONSULTANT_FEE_REPLACE_TEXT';
export const AUDITOR_FEE_REPLACE_TEXT = 'AUDITOR_FEE_REPLACE_TEXT';

export const EXCESS = [
    {
        title: 'Storm, Tempest',
        value: '1% of Total Sum Insured or RM 200 Whichever Is Less'
    },
    {
        title: 'Flood',
        value: '1% of Total Sum Insured or RM 2,500 Whichever Is Less'
    },
    {
        title: "Impact Damage (Including Insured's Own Vehicles)",
        value: 'RM 250.00 Each and Every Claim'
    },
    {
        title: 'Bursting or Overflowing of Water Tanks, Apparatus, or Pipes',
        value: 'First RM 1,000 for Each and Every Loss for Each Separate Premises. For Sums Insured Less Than RM 50,000, 1% of Sum Insured Subject to a Minimum of RM 100'
    }
]

export const TAX_PERCENTAGE = 8;
export const STAMP_DUTY = 10.00;

export const TYPE_OF_CLAIM = [
  { id: "Fire", value: "Fire" },
  { id: "Flood", value: "Flood" },
  { id: "Windstorm", value: "Windstorm" },
  { id: "Burglary", value: "Burglary" },
  { id: "Money", value: "Money" },
  { id: "Plate Glass", value: "Plate Glass" },
  { id: "Fidelity Guarantee", value: "Fidelity Guarantee" },
  { id: "Public Liability", value: "Public Liability" },
  { id: "Others", value: "Others" },
];

export const PROTECTION_AND_LIABILITY_COVERAGE = {
  id: 3001,
  icon: "/icons/icon-protection.svg",
  name: "Protection and Liability Coverage",
  premuimAmount: 405,
  coverageValue: 1300000,
  premiumLabel:
    "Protection against a wide range of risks, including theft, vandalism, accidental damage, and more.",
  contents: [
    {
      title: "Burglary RM 20,000",
      //contents: ["Cover Items in Section A - Fire"],
      contents: [""],
      info: "Protects your goods and all properties properly locked and secured in your insured Premises against Burglary or robbery (with forcible entry).",
    },
    {
      title: "Money",
      //contents: [
      // "Money Inside Premises RM 5,000\nDuring and after business hours kept in locked safe or strong room, locked drawers/cabinets, cash registers.",
      // "Money in Transit RM 5,000\nOutside premises (from premises to bank or contract sites or vice versa)",
      //],
      contents: ["Money Inside Premises RM 5,000", "Money in Transit RM 5,000"],
      info: "Covers your cash, bank and currency notes, cheques and money orders against Burglary or robbery whilst in transit to and from the bank, contract sites and in your insured Premises during and after business hours.",
    },
    {
      title: "Fidelity Guarantee RM 10,000",
      //contents: ["Amount of Guarantee (in aggregate for all employees)"],
      contents: [""],
      info: "Insures you against loss of money and/or property due to fraud or act of dishonesty of your employee.",
    },
    {
      title: "Plate Glass RM 10,000",
      //contents: ["Glass and Signage"],
      contents: [""],
      info: "We cover your signage and Glass panels against accidental breakage.",
    },
    {
      title: "Public Liability RM 1,000,000",
      //  contents: ["Limit of Liability during the Period of Insurance"],
      contents: [""],
      info: "Protection is provided for you against third party claims resulting from Bodily Injury or Property Damage which took place at your Premises.",
    },
    {
      title: "Employer Liability RM 250,000",
      //contents: [
       // "Limit of Liability for any one claim or series of claims arising out of one event, irrespective of the number of claims that may arise therefrom and during any one Period of Insurance.",
      //],
      contents: [""],
      info: "Covers you against liabilities in the event of Bodily Injury sustained by employees due to work related accidents or disease.",
    },
  ],
};

export const TOOLTIP_INFO = {
    fireAndPerilsIns: {
        title: 'Protection from fire and listed perils',
        contents: [
            'Storm',
            'Tempest',
            'Flood',
            'Bursting or overflowing of water tanks',
            'Explosion - non-industrial without boilers',
            'Earthquake & volcanic eruption',
            "Impact damage (including insured's own vehicles)",
            "Riot, strike, and malicious damage (non-residential)",
            "Sprinkler leakage - building and contents",
            "Electrical installations clause (applicable for plant & machinery only)"
        ]
    },
    excess: {
        title: '',
        content: 'The first amount of loss that has to be burne by the Policyholder. Insurer will deduct this amount from the total claim and pay the remaining amount.'
    }
}
