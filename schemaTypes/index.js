import heroBlock from './heroBlock';
import ctaBanner from './ctaBanner';
import pricingCard from './pricingCard';
import mentor from './mentor';
import project from './project';
import homePage from './homePage';
import kickstarterPage from './kickstarterPage';
import generalistPage from './generalistPage';
import engineeringPage from './engineeringPage';
import campaignPage from './campaignPage';

// Objects must be registered before the documents that embed them.
export const schemaTypes = [
  heroBlock, ctaBanner, pricingCard,
  mentor, project,
  homePage, kickstarterPage, generalistPage, engineeringPage, campaignPage,
];
