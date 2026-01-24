export interface CompanyInfo {
    name: string;
    address: {
        street: string;
        area: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
    };
    contact: {
        phone: string;
        email: string;
        whatsapp: string;
    };
    social: {
        instagram: string;
        facebook: string;
        linkedin: string;
    };
    hours: {
        weekdays: string;
        weekend: string;
    };
}

export const COMPANY_INFO: CompanyInfo = {
    name: "Starwood Interiors",
    address: {
        street: "TC 25/1234, MG Road",
        area: "Thampanoor",
        city: "Trivandrum",
        state: "Kerala",
        pincode: "695001",
        country: "India"
    },
    contact: {
        phone: "+91 77368 32115",
        email: "starwood@designstudio.ae",
        whatsapp: "917736832115"
    },
    social: {
        instagram: "https://www.instagram.com/starwoodinteriors",
        facebook: "https://www.facebook.com/starwoodinteriors",
        linkedin: "https://www.linkedin.com/company/starwoodinteriors"
    },
    hours: {
        weekdays: "Monday to Saturday: 9:00 AM – 5:00 PM",
        weekend: "Sunday & Public Holidays: Closed"
    }
};
