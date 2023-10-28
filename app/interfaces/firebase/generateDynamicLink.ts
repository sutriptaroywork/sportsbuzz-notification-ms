import { GenerateLinkType } from '@enums/firebase/generateLinkType';

export default interface GenerateDynamicLinkV2Interface {
  type: GenerateLinkType;
  code: string;
  sportsType?: string;
  id?: string;
}
