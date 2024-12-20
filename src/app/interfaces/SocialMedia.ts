import { SocialMediaType } from "./SocialMediaType";

export interface SocialMedia {
    url:string,
    socialMediaTypeId: number,
    socialMediaType?: SocialMediaType
}