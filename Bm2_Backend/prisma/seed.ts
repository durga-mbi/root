import { faker } from "@faker-js/faker";
import {
  PrismaClient,
  aa4_category_db_status,
  aa4_category_db_add_to_website,
  aa13_customer_db_status,
  x1_app_product_register_is_display,
  caa1_shop_stock_item_db_status,
  x2_app_product_img_register_status,
  x7_app_users_coupon_code_status,
} from "@prisma/client";

const prisma = new PrismaClient();

const categoryData = [
  { name: "GARMENTS", desc: "Latest fashion and trendy cloths" },
  { name: "GROCERY", desc: "Daily essentials and fresh grocery items" },
  { name: "TOYS", desc: "Fun and educational toys for all ages" },
  { name: "SHOES", desc: "Comfortable and stylish footwear" },
  { name: "ELECTRONICS", desc: "Latest gadgets, phones and accessories" },
  { name: "BEAUTY", desc: "Personal care and beauty products" },
  { name: "HOME & LIFESTYLE", desc: "Everything for your home" },
];

async function main() {
  console.log("🌱 Checking database state...");

  const existingCategories = await prisma.category.count();
  if (existingCategories > 0) {
    console.log("✅ Database already has data. Skipping seed.");
    return;
  }

  console.log("🌱 Starting Database Seeding...");

  // 2. Clear existing data (in case of partial data)
  console.log("🧹 Cleaning up old data if any...");
  await prisma.coinTransaction.deleteMany();
  await prisma.x12_app_user_bm_coins.deleteMany();
  await prisma.orderReturn.deleteMany();
  await prisma.x10_app_order_status.deleteMany();
  await prisma.x11_app_payment_details.deleteMany();
  await prisma.x9_app_order_details.deleteMany();
  await prisma.x8_app_orders_master.deleteMany();
  await prisma.x5_app_cart.deleteMany();
  await prisma.x7_app_users_coupon_code.deleteMany();
  await prisma.couponCode.deleteMany();
  await prisma.productRating.deleteMany();
  await prisma.userAddress.deleteMany();
  await prisma.shopStockItem.deleteMany();
  await prisma.productImageRegister.deleteMany();
  await prisma.productRegister.deleteMany();
  await prisma.category.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.coinConfig.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.appContent.deleteMany();
  await prisma.enquiry.deleteMany();

  console.log("✅ Cleanup complete.");

  // 2. Seed CoinConfig
  console.log("💰 Seeding CoinConfig...");
  await prisma.coinConfig.create({
    data: {
      versionNumber: 1,
      minEligibleAmount: 100,
      maxEligibleAmount: 10000,
      rewardPercentMin: 1,
      rewardPercentMax: 5,
      maxCoinsPerOrder: 500,
      redeemPercentLimit: 20,
      returnPeriodDays: 7,
      isActive: true,
    },
  });

  // 3. Seed Categories
  console.log("📁 Seeding Categories...");
  const createdCategories = [];
  for (let i = 0; i < categoryData.length; i++) {
    const item = categoryData[i];
    const cat = await prisma.category.create({
      data: {
        comId: 1,
        catName: item.name,
        catCode: item.name.substring(0, 3).toUpperCase(),
        catDesc: item.desc,
        categoryImage: `https://loremflickr.com/320/240/${item.name.toLowerCase().replace(/ & /g, ",")},shopping?lock=${i}`,
        disorder: i,
        status: aa4_category_db_status.ONE,
        addToWebsite: aa4_category_db_add_to_website.ONE,
      },
    });
    createdCategories.push(cat);
  }

  // 4. Seed Customers & Addresses
  console.log("👥 Seeding Customers...");
  const customers = [];
  for (let i = 0; i < 20; i++) {
    const customer = await prisma.customer.create({
      data: {
        comId: 1000 + i,
        fullName: faker.person.fullName(),
        contactNo: i === 0 ? "1234567890" : faker.string.numeric(10),
        emailId: faker.internet.email(),
        status: aa13_customer_db_status.ONE,
        coinBalance: faker.number.int({ min: 0, max: 1000 }),
      },
    });
    customers.push(customer);

    // Add 1-2 addresses for each customer
    const addressCount = faker.number.int({ min: 1, max: 2 });
    for (let j = 0; j < addressCount; j++) {
      await prisma.userAddress.create({
        data: {
          userId: customer.id,
          address: faker.location.streetAddress(true),
          townCity: faker.location.city(),
          state: faker.location.state(),
          pincode: faker.string.numeric(6),
          receiversName: customer.fullName,
          receiversNumber: customer.contactNo,
          saveAs: j === 0 ? "Home" : "Office",
          isDefault: j === 0,
        },
      });
    }
  }

  // 5. Seed Coupon Codes
  console.log("🎟️ Seeding Coupon Codes...");
  const coupons = [];
  for (let i = 0; i < 5; i++) {
    const coupon = await prisma.couponCode.create({
      data: {
        name: `SAVE${(i + 1) * 10}`,
        description: `Get ${(i + 1) * 10}% off on your purchase`,
        termsConditions: "Valid for orders above 500. Maximum discount 200.",
        validDate: faker.date.future(),
        issuedQnty: 100,
        receivedQnty: faker.number.int({ min: 0, max: 50 }),
        userQnty: 1,
        validPrice: 500,
      },
    });
    coupons.push(coupon);
  }

  // 6. Seed Products, Stock, Images, and Ratings
  console.log("📦 Seeding Products and related data...");
  const products = [];
  for (let i = 0; i < 40; i++) {
    const productIdNum = 10000 + i;
    const cat = faker.helpers.arrayElement(createdCategories);

    const product = await prisma.productRegister.create({
      data: {
        comId: 1,
        productName: faker.commerce.productName(),
        productId: productIdNum,
        shdesc: faker.commerce.productDescription(),
        lgdesc: faker.lorem.paragraphs(3),
        keyFeatures: faker.lorem.sentences(5),
        displaySection: faker.helpers.arrayElement([
          "Fashion",
          "Trending",
          "Featured",
          "New Arrivals",
        ]),
        isDisplay: x1_app_product_register_is_display.ONE,
        ratings: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
        deliveryDays: faker.number.int({ min: 2, max: 7 }),
      },
    });
    products.push(product);

    // Stock
    const mrp = parseFloat(faker.commerce.price({ min: 100, max: 5000 }));
    await prisma.shopStockItem.create({
      data: {
        itemId: productIdNum,
        itemName: product.productName,
        catId: cat.id,
        catName: cat.catName,
        mrpRate: mrp.toString(),
        saleRate: mrp * 0.9,
        curQty: faker.number.int({ min: 10, max: 500 }),
        status: caa1_shop_stock_item_db_status.ONE,
        indate: new Date(),
        brandName: faker.company.name(),
      },
    });

    // Multiple Images
    const imgCount = faker.number.int({ min: 1, max: 4 });
    for (let k = 0; k < imgCount; k++) {
      await prisma.productImageRegister.create({
        data: {
          productId: productIdNum,
          proimgs: `https://loremflickr.com/640/480/product?lock=${i * 10 + k}`,
          status: x2_app_product_img_register_status.ONE,
        },
      });
    }

    // Ratings from random customers
    const ratingCount = faker.number.int({ min: 0, max: 5 });
    for (let r = 0; r < ratingCount; r++) {
      const randomCust = faker.helpers.arrayElement(customers);
      await prisma.productRating.create({
        data: {
          productId: productIdNum,
          givenRatings: faker.number.int({ min: 1, max: 5 }),
          message: faker.lorem.sentence(),
          createdBy: randomCust.id,
        },
      });
    }
  }

  // 7. Seed Cart for some users
  console.log("🛒 Seeding Cart items...");
  for (let i = 0; i < 10; i++) {
    const cust = customers[i];
    const cartItemsCount = faker.number.int({ min: 1, max: 4 });
    const selectedProducts = faker.helpers.arrayElements(
      products,
      cartItemsCount,
    );

    for (const p of selectedProducts) {
      // Use upsert or try-catch for cart as it has unique constraint on comId_ItemId
      try {
        await prisma.x5_app_cart.create({
          data: {
            comId: cust.comId,
            ItemId: p.productId!,
            quantity: faker.number.int({ min: 1, max: 3 }),
          },
        });
      } catch (e) {
        // Skip duplicates
      }
    }
  }

  // 8. Seed Orders
  console.log("🧾 Seeding Orders...");
  for (let i = 0; i < 15; i++) {
    const cust = faker.helpers.arrayElement(customers);
    const orderIdStr = `ORD-${faker.string.alphanumeric(8).toUpperCase()}`;
    const productCount = faker.number.int({ min: 1, max: 3 });
    const orderProducts = faker.helpers.arrayElements(products, productCount);

    let totalAmount = 0;

    const orderMaster = await prisma.x8_app_orders_master.create({
      data: {
        order_id: orderIdStr,
        comId: cust.comId,
        total_amount: 0, // Will update below
        net_amount_payment_mode: faker.helpers.arrayElement([
          "UPI",
          "COD",
          "CARD",
        ]),
      },
    });

    for (const p of orderProducts) {
      const price = faker.number.int({ min: 200, max: 2000 });
      const qty = faker.number.int({ min: 1, max: 2 });
      const net = price * qty;
      totalAmount += net;

      await prisma.x9_app_order_details.create({
        data: {
          order_id: orderIdStr,
          comId: cust.comId,
          product_id: p.productId,
          qnty: qty,
          rate: price,
          net_amount: net,
          gst_percent: 18,
        },
      });
    }

    // Update Master total
    await prisma.x8_app_orders_master.update({
      where: { id: orderMaster.id },
      data: { total_amount: totalAmount },
    });

    // Order Status
    await prisma.x10_app_order_status.create({
      data: {
        order_id: orderIdStr,
        order_status: "ORDER PLACED",
        comId: cust.comId,
        created_by: cust.id,
      },
    });

    // Payment Details
    await prisma.x11_app_payment_details.create({
      data: {
        order_id: orderIdStr,
        payment_mode: orderMaster.net_amount_payment_mode,
        payment_details: JSON.stringify({
          txnId: faker.string.uuid(),
          status: "SUCCESS",
        }),
      },
    });

    // Possibly one return
    if (i === 0) {
      await prisma.orderReturn.create({
        data: {
          orderId: orderIdStr,
          productId: orderProducts[0].productId!,
          comId: cust.comId,
          returnReason: "Defective item",
          pickupDate: faker.date.soon(),
          refundAmount: totalAmount / 2,
          status: "PENDING",
        },
      });
    }
  }

  // 9. Seed Coin Transactions & User Coupons
  console.log("💎 Seeding Transactions and User Coupons...");
  for (let i = 0; i < 10; i++) {
    const cust = customers[i];

    // Some coin transactions
    await prisma.coinTransaction.create({
      data: {
        userId: cust.id,
        type: "EARN",
        amount: 50,
        status: "ACTIVE",
        creditDate: new Date(),
        configSnapshot: { version: 1 },
      },
    });

    // Some specific user coupons
    const coupon = faker.helpers.arrayElement(coupons);
    await prisma.x7_app_users_coupon_code.create({
      data: {
        user_id: cust.id,
        coupon_id: coupon.id,
        status: x7_app_users_coupon_code_status.ONE,
      },
    });

    // Coin summary entry
    await prisma.x12_app_user_bm_coins.create({
      data: {
        user_id: cust.id,
        total_coins: 100,
        used_coins: 50,
        net_bm_coins: 50,
      },
    });
  }

  // 10. Seed FAQs
  console.log("❓ Seeding FAQs...");
  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "Simply browse our products, add them to your cart, and proceed to checkout. Follow the on-screen instructions to complete your purchase.",
      category: "ORDERING",
      priority: 10,
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept all major credit/debit cards, UPI, net banking, and Cash on Delivery (COD) in most locations.",
      category: "PAYMENT",
      priority: 9,
    },
    {
      question: "Can I track my order?",
      answer:
        "Yes, once your order is dispatched, you will receive a tracking link in the 'My Orders' section of the app.",
      category: "SHIPPING",
      priority: 8,
    },
    {
      question: "How do I cancel my order?",
      answer:
        "You can cancel your order from the 'My Orders' section before it is out for delivery. A cancellation fee may apply if processing has started.",
      category: "ORDERING",
      priority: 7,
    },
    {
      question: "What if I receive a wrong item?",
      answer:
        "Please contact our support team within 24 hours of delivery. We will arrange a replacement or refund immediately.",
      category: "SUPPORT",
      priority: 6,
    },
    {
      question: "How do I use a coupon code?",
      answer:
        "Enter your coupon code in the 'Offers & Coupons' section at the checkout page to avail of the discount.",
      category: "PROMOTIONS",
      priority: 5,
    },
    {
      question: "Is my personal information secure?",
      answer:
        "Absolutely. We use high-level encryption and follow strict data protection protocols to ensure your information stays safe.",
      category: "SECURITY",
      priority: 4,
    },
  ];

  for (const faq of faqs) {
    await prisma.faq.create({
      data: {
        ...faq,
        isActive: true,
      },
    });
  }

  // 11. Seed App Content (Policies and Contact Info)
  console.log("📄 Seeding Policies and Contact Info...");
  const contents = [
    {
      slug: "terms",
      title: "Terms & Conditions",
      content: `
        <h1>Terms & Conditions</h1>
        <h3>1. Introduction</h3>
        <p>Welcome to BM Mall. By using our website or mobile app, you agree to comply with these Terms & Conditions, our Privacy Policy, and all applicable laws of the land.</p>
        <h3>2. Account Registration</h3>
        <p>To access certain features, you must register for an account. You agree to provide accurate information and keep it updated. You are solely responsible for all activity on your account.</p>
        <h3>3. Product Availability & Pricing</h3>
        <p>We strive for accuracy but errors in pricing or availability may occur. In such cases, we reserve the right to cancel orders and provide a full refund.</p>
        <h3>4. Order Acceptance</h3>
        <p>Receiving an order confirmation does not signify our acceptance of an order. We reserve the right to accept or decline any order for any reason at our sole discretion.</p>
        <h3>5. Payments & Security</h3>
        <p>All payments are processed through secure gateways. We do not store sensitive payment information on our servers. You agree to pay all charges incurred by you or your account.</p>
        <h3>6. Prohibited Activities</h3>
        <p>Users are prohibited from using the app for fraudulent purposes, reverse engineering the software, or attempting to breach our security protocols.</p>
        <h3>7. Termination of Service</h3>
        <p>We reserve the right to suspend or terminate your account at any time without prior notice if we believe you have violated these Terms & Conditions.</p>
      `,
    },
    {
      slug: "returns",
      title: "Return & Refund Policy",
      content: `
        <h1>Return & Refund Policy</h1>
        <h3>1. 7-Day Return Window</h3>
        <p>Most items are eligible for return within 7 days of delivery. The items must be unused, in original packaging, and with all tags intact.</p>
        <h3>2. Non-Returnable Items</h3>
        <p>Perishable goods (groceries), personal care products, inner wear, and clearance items are not eligible for return due to hygiene and safety reasons.</p>
        <h3>3. Damaged or Wrong Items</h3>
        <p>If you receive a damaged or incorrect item, please report it via the app within 24 hours of delivery with clear photographic evidence.</p>
        <h3>4. Return Process</h3>
        <p>Go to 'My Orders', select the order, and click 'Request Return'. Once approved, our delivery partner will pick up the item within 48 hours.</p>
        <h3>5. Quality Inspection</h3>
        <p>All returned items undergo a quality check at our warehouse. We reserve the right to reject returns if the item shows signs of use or damage.</p>
        <h3>6. Refund Timeline</h3>
        <p>Approved refunds are processed within 5-7 business days to your original payment method. For COD orders, refunds are credited to your BM Wallet.</p>
        <h3>7. Cancellation Policy</h3>
        <p>Orders can be cancelled anytime before they are out for delivery. Once the packing process has started, a small cancellation fee may apply.</p>
      `,
    },
    {
      slug: "shipping",
      title: "Shipping Policy",
      content: `
        <h1>Shipping Policy</h1>
        <h3>1. Delivery Coverage</h3>
        <p>We currently deliver across major urban centers. You can check the serviceability of your area by entering your pin code in the app.</p>
        <h3>2. Standard Delivery Times</h3>
        <p>Orders are typically delivered within 2-5 business days. Express delivery (same day or next day) may be available in select locations for an extra fee.</p>
        <h3>3. Shipping Charges</h3>
        <p>A nominal delivery fee is charged based on the order value and distance. Free delivery is provided for orders exceeding a specific threshold (e.g., ₹500).</p>
        <h3>4. Order Tracking</h3>
        <p>Real-time tracking is available in the 'Track Order' section as soon as your order is dispatched from our fulfillment center.</p>
        <h3>5. Delivery Attempts</h3>
        <p>Our partners will make up to three delivery attempts. If unsuccessful, the order will be returned to the hub and a refund will be initiated.</p>
        <h3>6. Packaging Excellence</h3>
        <p>We use eco-friendly and sturdy packaging to ensure your products reach you in pristine condition, especially for fragile items.</p>
        <h3>7. Address Changes</h3>
        <p>Shipping addresses can be modified only before the order is dispatched. Please contact support immediately for any urgent corrections.</p>
      `,
    },
    {
      slug: "privacy",
      title: "Privacy Policy",
      content: `
        <h1>Privacy Policy</h1>
        <h3>1. Information Collection</h3>
        <p>We collect personal information such as name, email, and phone number when you register an account or place an order.</p>
        <h3>2. Usage of Data</h3>
        <p>Your data is used to process transactions, improve our services, and send you important updates regarding your orders or account.</p>
        <h3>3. Data Sharing</h3>
        <p>We do not sell your personal data. We only share information with trusted third-party partners (like delivery and payments) necessary to fulfill your requests.</p>
        <h3>4. Cookies & Tracking</h3>
        <p>Our app uses cookies to enhance user experience and analyze traffic. You can manage your cookie preferences through your device settings.</p>
        <h3>5. Data Security</h3>
        <p>We implement industry-standard security measures to protect your data from unauthorized access, loss, or misuse.</p>
        <h3>6. Your Rights</h3>
        <p>You have the right to access, correct, or delete your personal data. Please contact our privacy officer for any such requests.</p>
        <h3>7. Policy Updates</h3>
        <p>We may update this policy periodically. Significant changes will be notified via the app or email. Continued use of the app signifies acceptance.</p>
      `,
    },
    {
      slug: "contact-info",
      title: "Contact Us",
      content: JSON.stringify({
        phone: "1800-123-4567",
        whatsapp: "+91-98765-43210",
        email: "support@bm2mall.com",
        office:
          "BM Mall HQ, 123 Tech Park, Sector 45, Bhubaneswar, Odisha - 751001",
        timings: "9:00 AM to 9:00 PM (Daily)",
        instagram: "@BMMallOfficial",
        facebook: "@BMMallOfficial",
        business_email: "business@bmmall.com",
      }),
    },
  ];

  for (const item of contents) {
    await prisma.appContent.create({
      data: item,
    });
  }

  console.log("✅ Seeding complete successfully for all tables!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
