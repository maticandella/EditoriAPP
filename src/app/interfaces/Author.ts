import { Nationality } from "./Nationality";
import { SocialMedia } from "./SocialMedia";

export interface Author {
    id: number,
    name: string;
    lastName: string;
    nacionalityId: number;
    isActive?: boolean;
    note?: string;
    photo?: string;
    nationality?: Nationality;
    socialMediaAccounts?: SocialMedia[];
}