
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
        logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgUfpQ6VgT90TjrCncQmagyauX5fKw9GByag&s",
        frontPhotoUrl: "https://img.freepik.com/free-photo/car-being-taking-care-workshop_23-2149580532.jpg?semt=ais_hybrid&w=740&q=80",
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
        logoUrl: "https://img.freepik.com/premium-vector/auto-repair-garage-logo-automotive-industry_160069-63.jpg?semt=ais_hybrid&w=740&q=80",
        frontPhotoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxsjTcikRH1Rx1ItKN7ZNOg1csXojL89Aibw&s",
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
        logoUrl: "https://cbx-prod.b-cdn.net/COLOURBOX30616352.jpg?width=800&height=800&quality=70",
        frontPhotoUrl: "https://media.istockphoto.com/id/1892179107/photo/cars-open-bonnet-parked-in-garage-for-repair-and-maintenance-service.jpg?s=612x612&w=0&k=20&c=wMIlCxuCPfCl-uWfUF_W1IzGZPPlIUUkbQq68kpKtvo=",
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
        frontPhotoUrl: "https://media.istockphoto.com/id/1554627149/photo/auto-mechanic-are-repair-and-maintenance-auto-engine-is-problems-at-car-repair-shop.jpg?s=612x612&w=0&k=20&c=_zvBz-ZNgQhK5YgpihiLsOvjTC0yWFYsHEJt-WdCgp0=",
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
        frontPhotoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0UK91rBsDChCxzwFK6yHkcdWGkP3j6oNUJA&s",
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
        logoUrl: "https://www.shutterstock.com/image-vector/car-logo-design-automotive-showroom-600nw-2394683351.jpg",
        frontPhotoUrl: "https://www.shutterstock.com/image-photo/eastern-ethnic-handsome-black-hair-600nw-2068470272.jpg",
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
        logoUrl: "https://thumbs.dreamstime.com/b/concept-design-illustrator-vector-automotive-workshop-logo-template-isolated-white-transparent-background-car-repair-shop-158279325.jpg",
        frontPhotoUrl: "https://www.getac.com/content/dam/uploads/2023/03/autorepairworkshop_cover.png",
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
        frontPhotoUrl: "https://www.shutterstock.com/image-photo/auto-body-technician-meticulously-inspecting-600nw-2703117191.jpg",
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
