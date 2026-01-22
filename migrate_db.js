const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const products = db.products || [];
const sales = db.sales || [];

// Create a map of products by ID for easy access
const productMap = {};
products.forEach(p => {
    productMap[p.id] = { ...p, sales: [], stats: { totalSales: 0, revenue: 0 } };
});

// Distribute sales to products
const orphanSales = [];

sales.forEach(sale => {
    const pId = sale.productId;
    if (productMap[pId]) {
        productMap[pId].sales.push(sale);
        // Update product stats
        productMap[pId].stats.totalSales += Number(sale.quantity);
        productMap[pId].stats.revenue += (Number(sale.unitPrice) * Number(sale.quantity));
    } else {
        orphanSales.push(sale);
    }
});

// Handle orphan sales (sales whose products were deleted)
// We'll create "Legacy Product" entries for these to preserve data
const legacyProducts = {};

orphanSales.forEach(sale => {
    if (!legacyProducts[sale.productId]) {
        legacyProducts[sale.productId] = {
            id: sale.productId,
            name: sale.productName || "Legacy Product",
            sku: "LEGACY-" + sale.productId,
            category: sale.category || "Legacy",
            price: sale.unitPrice,
            quantity: 0,
            description: "Product was deleted but sales history preserved.",
            status: "Discontinued",
            sales: [],
            stats: { totalSales: 0, revenue: 0 }
        };
    }
    legacyProducts[sale.productId].sales.push(sale);
    legacyProducts[sale.productId].stats.totalSales += Number(sale.quantity);
    legacyProducts[sale.productId].stats.revenue += (Number(sale.unitPrice) * Number(sale.quantity));
});

// Combine active products and legacy products
const newProductsList = [
    ...Object.values(productMap),
    ...Object.values(legacyProducts)
];

// Create new DB structure
const newDb = {
    products: newProductsList
    // 'sales' and 'stats' are removed from root
};

// Write back to file
fs.writeFileSync(dbPath, JSON.stringify(newDb, null, 2));

console.log('Migration complete!');
console.log(`Merged ${sales.length} sales into ${products.length} active products.`);
if (Object.keys(legacyProducts).length > 0) {
    console.log(`Restored ${Object.keys(legacyProducts).length} legacy products from orphan sales.`);
}
