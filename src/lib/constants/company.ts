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
        street: "4th floor, Uthradam Properties, Opposite SP Grand Days Hotel, Panavila",
        area: "Thycaud",
        city: "Trivandrum",
        state: "Kerala",
        pincode: "695014",
        country: "India"
    },
    contact: {
        phone: "+91 7736832115",
        email: "starwood@designstudio.ae",
        whatsapp: "917736832115"
    },
    social: {
        instagram: "https://www.instagram.com/starwoodinteriors?igsh=bm5zeGgzdjJ0dnJq",
        facebook: "https://www.instagram.com/starwoodinteriors?igsh=bm5zeGgzdjJ0dnJq",
        linkedin: "https://www.linkedin.com/company/starwood-interiors-kerala/"
    },
    hours: {
        weekdays: "Monday to Saturday: 9:00 AM – 5:00 PM",
        weekend: "Sunday & Public Holidays: Closed"
    }
};
