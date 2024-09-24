import { AssetsTable } from '../table';
import { TabContent } from './tab-content';

export function PortfolioTab() {
    return (
        <TabContent
            description="Details on the distribution of assets among different financial institutions or investment vehicles."
            label="Portfolio"
        >
            <AssetsTable />
        </TabContent>
    );
}
