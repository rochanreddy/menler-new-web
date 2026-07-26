import heroBlock from './heroBlock';
import ctaBanner from './ctaBanner';
import pricingCard from './pricingCard';
import curricWeek from './curricWeek';
import curricDomain from './curricDomain';
import curricPhase from './curricPhase';
import kickDay from './kickDay';
import kickModule from './kickModule';
import mentor from './mentor';
import project from './project';
import playbook from './playbook';
import homePage from './homePage';
import kickstarterPage from './kickstarterPage';
import generalistPage from './generalistPage';
import engineeringPage from './engineeringPage';
import campaignPage from './campaignPage';

// Objects must be registered before the documents that embed them.
export const schemaTypes = [
  heroBlock, ctaBanner, pricingCard,
  curricWeek, curricDomain, curricPhase, kickDay, kickModule,
  mentor, project, playbook,
  homePage, kickstarterPage, generalistPage, engineeringPage, campaignPage,
];
