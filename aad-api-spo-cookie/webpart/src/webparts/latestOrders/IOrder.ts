export interface IOrder {
    name: string;
    jobTitle: Date;
    phone: Region;
    email: string;
    url: string;
}

export type Region = "east" | "central" | "west";