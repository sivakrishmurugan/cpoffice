import { DEFAULT_FIRE_INS_PERCENTAGE, DEFAULT_FIRE_PERILS_INS_PERCENTAGE, MIN_COVERAGE_PREMIUM, PROTECTION_AND_LIABILITY_COVERAGE, STAMP_DUTY, TAX_PERCENTAGE } from "./app/app_constants";
import { CoverageResData } from "./hooks/use_sessionstorage";
import { Coverage, InsuranceType, SelectedCoverage } from "./types";

export const percentageResult = (percent: number, total: number) => {
    const result = ((percent/ 100) * total).toFixed(2);
    return result;
};

export const getTotalPremiumsForFireAndPerilsInsurance = (selectedCoverages: SelectedCoverage[], coveragesData: Coverage[]) => {
    return selectedCoverages.reduce((out, selected) => {
        const coverageData = coveragesData?.find(e => e.CoverageID == selected.id);
        if(coverageData == null) return out;
        const total = (selected.field_1 ?? 0) + (selected?.field_2 ?? 0);
        let calculatedResultForFireInsPremium = percentageResult(coverageData?.Fireinsurance ?? DEFAULT_FIRE_INS_PERCENTAGE, total);
        let calculatedResultForFireAndPerilsInsPremium = percentageResult(coverageData?.FirePerlis ?? DEFAULT_FIRE_PERILS_INS_PERCENTAGE, total);
        out.fireInsPremiumTotal.actual += parseFloat(calculatedResultForFireInsPremium.toString());
        out.fireAndPerilsInsPremiumTotal.actual += parseFloat(calculatedResultForFireAndPerilsInsPremium.toString());

        out.fireInsPremiumTotal.rounded = out.fireInsPremiumTotal.actual < MIN_COVERAGE_PREMIUM ? MIN_COVERAGE_PREMIUM : out.fireInsPremiumTotal.actual;
        out.fireAndPerilsInsPremiumTotal.rounded = out.fireAndPerilsInsPremiumTotal.actual < MIN_COVERAGE_PREMIUM ? MIN_COVERAGE_PREMIUM : out.fireAndPerilsInsPremiumTotal.actual;

        out.sumInsuredTotal += total;
        return out;
    }, { fireInsPremiumTotal: { actual: 0, rounded: 0 }, fireAndPerilsInsPremiumTotal: { actual: 0, rounded: 0 }, sumInsuredTotal: 0 }) ?? { fireInsPremiumTotal: { actual: 0, rounded: 0 }, fireAndPerilsInsPremiumTotal: { actual: 0, rounded: 0 }, sumInsuredTotal: 0 };
}

export const calculatePremiumForCoverage = (selectedCoverage: SelectedCoverage, type: 'FIRE' | 'FIRE_PERILS', coverage?: Coverage) => {
    const total = (selectedCoverage.field_1 ?? 0) + (selectedCoverage?.field_2 ?? 0);
    return type == 'FIRE' ? percentageResult(coverage?.Fireinsurance ?? DEFAULT_FIRE_INS_PERCENTAGE, total) : percentageResult(coverage?.FirePerlis ?? DEFAULT_FIRE_PERILS_INS_PERCENTAGE, total);
}

export const calculatePremiumForOptionalCoverage = (
    selectedOptionalCoverage: SelectedCoverage | undefined, 
    optionalCoverageData: Coverage,
    type: InsuranceType, 
    selectedCoverages: SelectedCoverage[],
    coveragesData: Coverage[]
) => {
    if(optionalCoverageData == null) return '0';
    const total = (selectedOptionalCoverage?.field_1 ?? 0) + (selectedOptionalCoverage?.field_2 ?? 0);
    const selectedInsType = type ?? 'FIRE';

    const { fireInsPremiumTotal, fireAndPerilsInsPremiumTotal, sumInsuredTotal } = getTotalPremiumsForFireAndPerilsInsurance(selectedCoverages, coveragesData)

    const abrPercentage = selectedInsType == 'FIRE' ?
        fireInsPremiumTotal.rounded / sumInsuredTotal :
        fireAndPerilsInsPremiumTotal.rounded / sumInsuredTotal;
        
    return optionalCoverageData.IsABR != 1 ? percentageResult(optionalCoverageData.InsPercent, total) : percentageResult(abrPercentage, total);
}

export const calculateSummary = (
    selectedCoverages: SelectedCoverage[], 
    selectedOptionalCoverages: SelectedCoverage[], 
    selectedInsType: InsuranceType, 
    promoCodeDiscount: number, 
    coveragesData: CoverageResData
) => {
    const { fireInsPremiumTotal, fireAndPerilsInsPremiumTotal } = getTotalPremiumsForFireAndPerilsInsurance(selectedCoverages ?? [], coveragesData.coverages ?? []);
    const coveragesTotalPremium = selectedInsType == 'FIRE' ? fireInsPremiumTotal.rounded : fireAndPerilsInsPremiumTotal.rounded;

    const optionalCoveragesTotalPremium = selectedOptionalCoverages?.reduce((out, coverage) => {
        let coverageData = coveragesData?.optionalCoverages?.find(e => e.CoverageID == coverage.id);
        const isProtectionAndLiabilityCoverage = coverage.id == PROTECTION_AND_LIABILITY_COVERAGE.id;
        if(isProtectionAndLiabilityCoverage) {
            coverage = { id: coverage.id, field_1: PROTECTION_AND_LIABILITY_COVERAGE.coverageValue }
            coverageData = {
                CoverageName: PROTECTION_AND_LIABILITY_COVERAGE.name,
                isABR: 0,
                InsPercent: 0.0405,
            } as any
        }
        const premium = calculatePremiumForOptionalCoverage(coverage, coverageData!, selectedInsType == 'FIRE' ? 'FIRE' : 'FIRE_PERILS', selectedCoverages ?? [], coveragesData?.coverages)
        return out + Number(premium);
    }, 0) ?? 0

    const totalPremium = Number((coveragesTotalPremium + optionalCoveragesTotalPremium).toFixed(2));
    const discount = Number(Number(percentageResult(promoCodeDiscount, totalPremium)).toFixed(2));
    const netPremium = Number((totalPremium - discount).toFixed(2));
    const tax = Number(Number(percentageResult(TAX_PERCENTAGE, totalPremium)).toFixed(2));
    const finalPremium = Number((netPremium + tax + STAMP_DUTY).toFixed(2));

    return { totalPremium, discount, netPremium, tax, finalPremium }
}