
const workshops = [
    {
        _id: "695935601369bcdad93f5f81",
        type: "workshop",
        services: ["Oil Change", "Brake Repair", "Tire Service"],
        offersOutdoorServices: true,
        status: "active",
        workshopName: "AutoPro Solutions",
        crNumber: "1010123456",
        vatNumber: "300012345600003",
        logoUrl: "https://www.logodesign.net/logo/abstract-car-in-circle-3561ld.png",
        frontPhotoUrl: "https://images.unsplash.com/photo-1486006396113-c7b3df928c0e?q=80&w=1000&auto=format&fit=crop",
        technicians: ["Ahmed", "Sami", "John"],
        rating: 4.8,
        address: "King Fahd Rd, Riyadh",
        phone: "+966 50 123 4567"
    },
    {
        _id: "695935601369bcdad93f5f82",
        type: "workshop",
        services: ["Engine Tuning", "AC Repair"],
        offersOutdoorServices: true,
        status: "pending",
        workshopName: "QuickFix Garage",
        crNumber: "2020234567",
        vatNumber: "300023456700003",
        logoUrl: "https://www.logodesign.net/logo/car-with-wrench-and-gear-3564ld.png",
        frontPhotoUrl: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=1000&auto=format&fit=crop",
        technicians: ["ali", "zaid", "taha", "malik"],
        rating: 4.5,
        address: "Al Tahlia St, Jeddah",
        phone: "+966 55 987 6543"
    },
    {
        _id: "695935601369bcdad93f5f83",
        type: "workshop",
        services: ["Paint Job", "Body Work"],
        offersOutdoorServices: false,
        status: "active",
        workshopName: "Elite Performance Center",
        crNumber: "3030345678",
        vatNumber: "300034567800003",
        logoUrl: "https://www.logodesign.net/logo/racing-car-on-shield-3566ld.png",
        frontPhotoUrl: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1000&auto=format&fit=crop",
        technicians: ["Omar", "Khalid"],
        rating: 5.0,
        address: "Prince Sultan Rd, Jeddah",
        phone: "+966 54 111 2222"
    },
    {
        _id: "695935601369bcdad93f5f84",
        type: "workshop",
        services: ["Battery", "Electrical"],
        offersOutdoorServices: true,
        status: "active",
        workshopName: "Modern Wheels Service",
        crNumber: "4040456789",
        vatNumber: "300045678900003",
        logoUrl: "https://www.logodesign.net/logo/car-and-sun-3567ld.png",
        frontPhotoUrl: "https://images.unsplash.com/photo-1530046339160-ce3e5b0c7a2f?q=80&w=1000&auto=format&fit=crop",
        technicians: ["Musa", "Ismail", "Yusuf"],
        rating: 4.2,
        address: "Olaya St, Riyadh",
        phone: "+966 56 333 4444"
    },
    {
        _id: "695935601369bcdad93f5f85",
        type: "workshop",
        services: ["Tires", "Alignment"],
        offersOutdoorServices: false,
        status: "active",
        workshopName: "Tire & Brake Specialist",
        crNumber: "5050567890",
        vatNumber: "300056789000003",
        logoUrl: "https://www.logodesign.net/logo/car-tire-3568ld.png",
        frontPhotoUrl: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=1000&auto=format&fit=crop",
        technicians: ["Ali", "Hassan"],
        rating: 4.7,
        address: "Al Khobar Corniche",
        phone: "+966 53 555 6666"
    },
    {
        _id: "695935601369bcdad93f5f86",
        type: "workshop",
        services: ["Transmission", "Diagnostics"],
        offersOutdoorServices: true,
        status: "pending",
        workshopName: "Golden Key Auto",
        crNumber: "6060678901",
        vatNumber: "300067890100003",
        logoUrl: "https://www.logodesign.net/logo/auto-key-3569ld.png",
        frontPhotoUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000&auto=format&fit=crop",
        technicians: ["Ibrahim", "Yahya"],
        rating: 4.4,
        address: "Dammam City Center",
        phone: "+966 52 777 8888"
    },
    {
        _id: "695935601369bcdad93f5f87",
        type: "workshop",
        services: ["Full Service", "Car Wash"],
        offersOutdoorServices: true,
        status: "active",
        workshopName: "Master Garage",
        crNumber: "7070789012",
        vatNumber: "300078901200003",
        logoUrl: "https://www.logodesign.net/logo/shield-and-car-3570ld.png",
        frontPhotoUrl: "https://images.unsplash.com/photo-1517524008436-bbdb53c54434?q=80&w=1000&auto=format&fit=crop",
        technicians: ["Saad", "Bilal", "Hamza"],
        rating: 4.9,
        address: "Industrial Area, Riyadh",
        phone: "+966 51 999 0000"
    },
    {
        _id: "695935601369bcdad93f5f88",
        type: "workshop",
        services: ["Diagnostics", "Eco Repair"],
        offersOutdoorServices: false,
        status: "active",
        workshopName: "Eco Auto Service",
        crNumber: "8080890123",
        vatNumber: "300089012300003",
        logoUrl: "https://www.logodesign.net/logo/leaf-car-3571ld.png",
        frontPhotoUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1000&auto=format&fit=crop",
        technicians: ["Zayd", "Usman"],
        rating: 4.6,
        address: "Diplomatic Quarter, Riyadh",
        phone: "+966 50 222 3333"
    }
];

const getWorkshops = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: workshops
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching workshops",
            error: error.message
        });
    }
};

module.exports = {
    getWorkshops
};
