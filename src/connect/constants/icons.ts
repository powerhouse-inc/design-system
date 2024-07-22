import BudgetImg from '@/assets/icons/budget.png';
import GlobalImg from '@/assets/icons/global.png';
import LegalImg from '@/assets/icons/legal.png';
import ProfileImg from '@/assets/icons/profile.png';
import MakerdaoRWAPortfolioImg from '@/assets/icons/rwa-report.png';
import TemplateImg from '@/assets/icons/template.png';
import {
    BUDGET,
    DocumentType,
    GLOBAL,
    LEGAL,
    MAKERDAO_RWA_PORTFOLIO,
    PROFILE,
    TEMPLATE,
} from '@/connect';

export const iconMap: Record<DocumentType, string> = {
    [LEGAL]: LegalImg,
    [GLOBAL]: GlobalImg,
    [PROFILE]: ProfileImg,
    [BUDGET]: BudgetImg,
    [TEMPLATE]: TemplateImg,
    [MAKERDAO_RWA_PORTFOLIO]: MakerdaoRWAPortfolioImg,
};
