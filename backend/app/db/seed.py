from datetime import datetime, timezone
import uuid
from sqlmodel import Session, select
from app.core.database import engine, init_db
from app.core.security import get_password_hash
from app.core.config import settings
from app.models.admin import Admin
from app.models.category import Category
from app.models.product import Product, ProductImage
from app.models.banner import Banner
from app.models.setting import Setting

def seed_database():
    init_db()
    with Session(engine) as session:
        print("[+] Seeding Hamza Gadget Store database...")

        # 1. Seed Admin User
        admin_email = settings.ADMIN_EMAIL.lower().strip()
        existing_admin = session.exec(select(Admin).where(Admin.email == admin_email)).first()
        if not existing_admin:
            admin = Admin(
                email=admin_email,
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                full_name=settings.ADMIN_NAME,
                is_active=True
            )
            session.add(admin)
            print(f"[SUCCESS] Admin created: {admin_email}")
        else:
            existing_admin.hashed_password = get_password_hash(settings.ADMIN_PASSWORD)
            existing_admin.full_name = settings.ADMIN_NAME
            existing_admin.is_active = True
            session.add(existing_admin)
            print(f"[SUCCESS] Admin credentials synchronized: {admin_email}")

        # 2. Seed Store Settings
        default_settings = [
            ("store_name", settings.STORE_NAME, "Official store title"),
            ("store_phone", settings.STORE_PHONE, "Primary contact phone"),
            ("store_whatsapp", settings.STORE_WHATSAPP, "Direct customer WhatsApp support line"),
            ("store_email", settings.STORE_EMAIL, "Official contact email"),
            ("store_address", settings.STORE_ADDRESS, "Physical store address"),
            ("shipping_fee", str(settings.SHIPPING_FEE), "Standard delivery fee in PKR"),
            ("free_shipping_threshold", str(settings.FREE_SHIPPING_THRESHOLD), "Cart total threshold for free shipping in PKR"),
        ]
        for key, val, desc in default_settings:
            existing_s = session.exec(select(Setting).where(Setting.key == key)).first()
            if not existing_s:
                s = Setting(key=key, value=val, description=desc)
                session.add(s)
            else:
                existing_s.value = val
                session.add(existing_s)

        # 3. Seed Categories
        categories_data = [
            {
                "name": "Wireless Earbuds",
                "slug": "wireless-earbuds",
                "description": "High-fidelity sound, active noise cancellation, and seamless Bluetooth connectivity.",
                "image_url": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
                "display_order": 1,
            },
            {
                "name": "Smartwatches",
                "slug": "smartwatches",
                "description": "AMOLED displays, health tracking, sports modes, and long battery life.",
                "image_url": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
                "display_order": 2,
            },
            {
                "name": "Power Banks",
                "slug": "power-banks",
                "description": "High-capacity fast-charging power banks with 20W–65W PD output.",
                "image_url": "https://images.unsplash.com/photo-1609592807664-44bc28c89599?w=800&q=80",
                "display_order": 3,
            },
            {
                "name": "Fast Chargers & Adapters",
                "slug": "chargers-adapters",
                "description": "GaN chargers, dual-port wall adapters, and rapid 65W/100W power bricks.",
                "image_url": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80",
                "display_order": 4,
            },
            {
                "name": "Cables & Hubs",
                "slug": "cables-hubs",
                "description": "Braided Type-C, Lightning, and multi-port USB-C hubs built to last.",
                "image_url": "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80",
                "display_order": 5,
            },
            {
                "name": "Cases & Screen Protectors",
                "slug": "cases-protectors",
                "description": "Shockproof armor cases and tempered glass screen protectors for all smartphones.",
                "image_url": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80",
                "display_order": 6,
            },
        ]

        category_map = {}
        for cat_data in categories_data:
            cat = session.exec(select(Category).where(Category.slug == cat_data["slug"])).first()
            if not cat:
                cat = Category(**cat_data)
                session.add(cat)
                session.flush()
            category_map[cat_data["slug"]] = cat
        print("[SUCCESS] Categories seeded")

        # 4. Seed 14+ Sample Gadgets
        products_data = [
            {
                "name": "AuraPods Pro ANC Wireless Earbuds",
                "slug": "aurapods-pro-anc-wireless-earbuds",
                "sku": "HGS-AUD-001",
                "category_slug": "wireless-earbuds",
                "price": 6499.0,
                "discount_price": 4999.0,
                "stock": 25,
                "is_featured": True,
                "description": "Premium true wireless earbuds featuring 35dB Hybrid Active Noise Cancellation, transparency mode, deep bass drivers, and up to 36 hours total playtime with wireless charging case.",
                "specs": {
                    "Bluetooth": "5.3",
                    "Active Noise Cancellation": "35dB Hybrid ANC",
                    "Battery Life": "8h earbuds + 28h case",
                    "Charging": "Type-C Fast Charge + Qi Wireless",
                    "Water Resistance": "IPX5 Splashproof",
                    "Warranty": "6 Months Replacement"
                },
                "images": [
                    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
                    "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80"
                ]
            },
            {
                "name": "Titan Pulse X Ultra AMOLED Smartwatch",
                "slug": "titan-pulse-x-ultra-amoled-smartwatch",
                "sku": "HGS-WAT-001",
                "category_slug": "smartwatches",
                "price": 11999.0,
                "discount_price": 8999.0,
                "stock": 18,
                "is_featured": True,
                "description": "Luxury zinc-alloy smartwatch featuring a 2.02-inch HD AMOLED Always-On display, Bluetooth calling with noise reduction microphone, 120+ sports modes, and SpO2 heart tracking.",
                "specs": {
                    "Display": "2.02\" AMOLED (410x502 resolution)",
                    "Battery": "380mAh (Up to 7 days normal use)",
                    "Calling": "Bluetooth 5.2 Hi-Fi Call with Mic",
                    "Sensors": "Heart Rate, SpO2, Sleep Monitor",
                    "Water Resistance": "IP68 Certified",
                    "Body Material": "Titanium-Finish Alloy & Silicon Strap"
                },
                "images": [
                    "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"
                ]
            },
            {
                "name": "VoltMax 30,000mAh 65W PD Power Bank",
                "slug": "voltmax-30000mah-65w-pd-power-bank",
                "sku": "HGS-POW-001",
                "category_slug": "power-banks",
                "price": 8500.0,
                "discount_price": 6999.0,
                "stock": 15,
                "is_featured": True,
                "description": "Massive 30000mAh external battery pack with 65W Power Delivery output capable of charging MacBooks, laptops, tablets, and smartphones simultaneously with smart LED display.",
                "specs": {
                    "Capacity": "30,000mAh / 111Wh",
                    "Max Output": "65W USB-C Power Delivery",
                    "Ports": "2x USB-C, 2x USB-A QC 3.0",
                    "Display": "Smart Digital Percentage LED",
                    "Laptop Compatibility": "Yes (MacBook, Dell XPS, HP)",
                    "Safety": "10-layer smart IC protection"
                },
                "images": [
                    "https://images.unsplash.com/photo-1609592807664-44bc28c89599?w=800&q=80",
                    "https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=800&q=80"
                ]
            },
            {
                "name": "HyperGaN 67W Triple-Port Fast Wall Charger",
                "slug": "hypergan-67w-triple-port-fast-charger",
                "sku": "HGS-CHG-001",
                "category_slug": "chargers-adapters",
                "price": 4200.0,
                "discount_price": 3499.0,
                "stock": 30,
                "is_featured": True,
                "description": "Next-gen Gallium Nitride (GaN III) compact charger featuring dual USB-C PD and one USB-A port. Charges iPhone 15/16 from 0 to 60% in 30 minutes.",
                "specs": {
                    "Technology": "GaN III Semiconductor",
                    "Total Power": "67W Max",
                    "Ports": "2x USB-C (67W) + 1x USB-A (22.5W)",
                    "Plug Type": "UK / Pakistan Standard 3-Pin",
                    "Protection": "Overheat, Overvoltage, Short-circuit",
                    "Warranty": "1 Year Official Brand Warranty"
                },
                "images": [
                    "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80"
                ]
            },
            {
                "name": "ArmorWeave 240W Braided Type-C to Type-C Cable (2m)",
                "slug": "armorweave-240w-braided-type-c-cable",
                "sku": "HGS-CAB-001",
                "category_slug": "cables-hubs",
                "price": 1499.0,
                "discount_price": 1099.0,
                "stock": 45,
                "is_featured": False,
                "description": "Military-grade nylon braided 2-meter USB-C cable supporting up to 240W PD 3.1 charging and 480Mbps data transfer speed with aluminum alloy housing.",
                "specs": {
                    "Length": "2.0 Meters (6.6 ft)",
                    "Max Wattage": "240W (48V / 5A) PD 3.1",
                    "Material": "Kevlar-Reinforced Braided Nylon",
                    "Durability": "30,000+ Bend Tested",
                    "E-Marker Chip": "Integrated Smart Chip"
                },
                "images": [
                    "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80"
                ]
            },
            {
                "name": "MagShield Frosted Magnetic Case for iPhone 16 Pro",
                "slug": "magshield-frosted-magnetic-case-iphone-16-pro",
                "sku": "HGS-CAS-001",
                "category_slug": "cases-protectors",
                "price": 2499.0,
                "discount_price": 1850.0,
                "stock": 4, # Low stock demo!
                "is_featured": True,
                "description": "Matte frosted translucent back cover with ultra-strong N52 neodymium magnetic ring compatible with all MagSafe chargers and car mounts. Shock-absorbing TPU bumpers.",
                "specs": {
                    "Material": "Bayer Polycarbonate + Matte TPU",
                    "Drop Protection": "10ft Military Grade Drop Test",
                    "MagSafe": "38 Strong N52 Magnets",
                    "Camera Protection": "1.5mm Raised Alloy Bezel",
                    "Color": "Matte Titanium Gray"
                },
                "images": [
                    "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80"
                ]
            },
            {
                "name": "BassBeast Gaming Low-Latency Wireless Earbuds",
                "slug": "bassbeast-gaming-low-latency-wireless-earbuds",
                "sku": "HGS-AUD-002",
                "category_slug": "wireless-earbuds",
                "price": 3999.0,
                "discount_price": 2999.0,
                "stock": 22,
                "is_featured": False,
                "description": "Dedicated ultra-low 45ms gaming latency earbuds with RGB cyberpunk breathing lights, 13mm composite drivers, and dual environmental noise cancellation mics.",
                "specs": {
                    "Latency": "45ms Ultra-Low Gaming Mode",
                    "Lighting": "Cyberpunk Cyan & Gold RGB LED",
                    "Driver Size": "13mm Dynamic Titanium Diaphragm",
                    "Battery": "6h + 24h Charging Case",
                    "Bluetooth": "5.3 Gaming Chipset"
                },
                "images": [
                    "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&q=80"
                ]
            },
            {
                "name": "Horizon Apex GPS Sports Smartwatch",
                "slug": "horizon-apex-gps-sports-smartwatch",
                "sku": "HGS-WAT-002",
                "category_slug": "smartwatches",
                "price": 14500.0,
                "discount_price": 11999.0,
                "stock": 10,
                "is_featured": True,
                "description": "Built-in standalone dual-band GPS, 5ATM water resistance up to 50 meters, barometric altimeter, and rugged military-tested casing for outdoor sports and gym enthusiasts.",
                "specs": {
                    "GPS": "Dual-Band Multi-Satellite (GPS+GLONASS)",
                    "Water Resistance": "5ATM (50 Meters Swimming)",
                    "Battery": "Up to 14 Days Ultra Endurance",
                    "Display": "1.43\" Sapphire Glass AMOLED",
                    "Sports Modes": "150+ Recognized Workouts"
                },
                "images": [
                    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80"
                ]
            },
            {
                "name": "PocketSlim 10,000mAh 22.5W Magnetic Power Bank",
                "slug": "pocketslim-10000mah-225w-magnetic-power-bank",
                "sku": "HGS-POW-002",
                "category_slug": "power-banks",
                "price": 4999.0,
                "discount_price": 3899.0,
                "stock": 3, # Low stock demo!
                "is_featured": False,
                "description": "Ultra-slim 14mm profile power bank with 15W Qi wireless magnetic snap and 22.5W wired USB-C output. Built-in foldable zinc-alloy kickstand for video watching.",
                "specs": {
                    "Capacity": "10,000mAh",
                    "Wireless Output": "15W / 10W / 7.5W Qi Magnetic",
                    "Wired Output": "22.5W Super Charge / 20W PD",
                    "Kickstand": "Integrated Zinc-Alloy Stand",
                    "Thickness": "Only 14mm"
                },
                "images": [
                    "https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=800&q=80"
                ]
            },
            {
                "name": "NexHub 8-in-1 Aluminum USB-C Hub Adapter",
                "slug": "nexhub-8-in-1-aluminum-usb-c-hub",
                "sku": "HGS-CAB-002",
                "category_slug": "cables-hubs",
                "price": 5499.0,
                "discount_price": 4200.0,
                "stock": 14,
                "is_featured": False,
                "description": "Space gray aluminum dock with 4K@60Hz HDMI, 100W PD passthrough, Gigabit Ethernet RJ45, SD/TF card slots, and 3x USB 3.0 ports for MacBook, iPad, and laptops.",
                "specs": {
                    "Video Output": "HDMI 4K @ 60Hz HDR",
                    "Power Delivery": "100W USB-C Passthrough",
                    "Ethernet": "1000Mbps Gigabit RJ45",
                    "USB Ports": "3x USB-A 3.0 (5Gbps)",
                    "Housing": "Anodized Aerospace Aluminum"
                },
                "images": [
                    "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80"
                ]
            },
            {
                "name": "UltraGlass 9H Diamond Tempered Screen Protector (2-Pack)",
                "slug": "ultraglass-9h-diamond-screen-protector",
                "sku": "HGS-CAS-002",
                "category_slug": "cases-protectors",
                "price": 1200.0,
                "discount_price": 850.0,
                "stock": 50,
                "is_featured": False,
                "description": "Case-friendly 9H hardness tempered glass with electroplated oleophobic coating for fingerprint resistance and 99.99% optical clarity. Includes auto-alignment installation frame.",
                "specs": {
                    "Hardness": "9H Diamond Scratch Resistance",
                    "Thickness": "0.33mm Ultra-Thin",
                    "Touch Response": "Instant 120Hz Touch Accuracy",
                    "Package": "2x Screen Protectors + Alignment Frame"
                },
                "images": [
                    "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80"
                ]
            },
            {
                "name": "SpeedDual 30W Dual Port Mini Car Charger",
                "slug": "speeddual-30w-dual-port-mini-car-charger",
                "sku": "HGS-CHG-002",
                "category_slug": "chargers-adapters",
                "price": 1850.0,
                "discount_price": 1399.0,
                "stock": 20,
                "is_featured": False,
                "description": "All-metal thumb-sized car adapter that sits flush with your 12V/24V cigarette lighter socket. Features 30W USB-C PD and 18W USB-A QC 3.0 with soft ice-blue LED ring.",
                "specs": {
                    "Total Output": "30W Max Fast Charge",
                    "Ports": "1x USB-C (30W PD) + 1x USB-A (18W QC)",
                    "Input": "12V - 24V (Cars & Trucks)",
                    "Material": "Zinc Alloy Metallic Body"
                },
                "images": [
                    "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80"
                ]
            },
            {
                "name": "SonicAir Open-Ear Bone Conduction Headset",
                "slug": "sonicair-open-ear-bone-conduction-headset",
                "sku": "HGS-AUD-003",
                "category_slug": "wireless-earbuds",
                "price": 7500.0,
                "discount_price": 5999.0,
                "stock": 12,
                "is_featured": True,
                "description": "Ergonomic titanium wraparound open-ear headphones utilizing bone conduction technology for safe outdoor running, cycling, and workout awareness.",
                "specs": {
                    "Design": "Open-Ear Bone Conduction",
                    "Weight": "Ultra-light 28 grams",
                    "Battery": "10 Hours Continuous Playback",
                    "Water Resistance": "IP67 Sweatproof & Waterproof",
                    "Frame": "Memory Titanium Alloy"
                },
                "images": [
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
                ]
            },
            {
                "name": "LumiGlow RGB Magnetic MagSafe Wireless Charger",
                "slug": "lumiglow-rgb-magnetic-magsafe-wireless-charger",
                "sku": "HGS-CHG-003",
                "category_slug": "chargers-adapters",
                "price": 2800.0,
                "discount_price": 2199.0,
                "stock": 16,
                "is_featured": False,
                "description": "Sleek aluminum wireless charging disc with subtle gold ambient ring light and built-in heat dissipation cooling chip for optimal battery preservation.",
                "specs": {
                    "Power": "15W Max Fast Wireless Qi",
                    "Magnets": "Strong N52 Snap Ring",
                    "Cable": "Integrated 1.5m Braided Cable",
                    "Lighting": "Gold Ambient LED Ring"
                },
                "images": [
                    "https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=800&q=80"
                ]
            }
        ]

        for p_data in products_data:
            existing_p = session.exec(select(Product).where(Product.slug == p_data["slug"])).first()
            category = category_map.get(p_data["category_slug"])
            if not existing_p and category:
                product = Product(
                    name=p_data["name"],
                    slug=p_data["slug"],
                    sku=p_data["sku"],
                    category_id=category.id,
                    price=p_data["price"],
                    discount_price=p_data["discount_price"],
                    stock=p_data["stock"],
                    is_featured=p_data["is_featured"],
                    is_active=True,
                    description=p_data["description"],
                    specs=p_data["specs"],
                    created_at=datetime.now(timezone.utc),
                    updated_at=datetime.now(timezone.utc)
                )
                session.add(product)
                session.flush()

                for idx, img_url in enumerate(p_data["images"]):
                    p_img = ProductImage(
                        product_id=product.id,
                        image_url=img_url,
                        image_file_id=None,
                        display_order=idx,
                        is_thumbnail=(idx == 0)
                    )
                    session.add(p_img)
        print("[SUCCESS] 14 Sample gadget products seeded")

        # 5. Seed Banners
        banners_data = [
            {
                "title": "Upgrade Your Tech Lifestyle",
                "subtitle": "Discover premium wireless earbuds, AMOLED smartwatches, and GaN fast chargers with nationwide Cash on Delivery.",
                "badge": "NEW GENERATION 2026",
                "link_url": "/shop",
                "image_url": "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1600&q=85",
                "display_order": 1,
                "is_active": True
            },
            {
                "title": "Titan Pulse X Ultra",
                "subtitle": "Titanium finish, Always-On AMOLED, Hi-Fi Bluetooth calling. Special introductory discount.",
                "badge": "HOT DEAL",
                "link_url": "/shop?category=smartwatches",
                "image_url": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=1600&q=85",
                "display_order": 2,
                "is_active": True
            }
        ]
        for b_data in banners_data:
            existing_b = session.exec(select(Banner).where(Banner.title == b_data["title"])).first()
            if not existing_b:
                b = Banner(**b_data)
                session.add(b)
        print("[SUCCESS] Banners seeded")

        session.commit()
        print("[SUCCESS] Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
