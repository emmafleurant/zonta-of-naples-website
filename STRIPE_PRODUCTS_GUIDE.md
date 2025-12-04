# How to Add Products to Your Store via Stripe

Your store now automatically fetches products from Stripe! Here's how to add and manage products:

## Step 1: Access Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/products)
2. Make sure you're in **Test Mode** (toggle in the top right)

## Step 2: Create a Product

1. Click **"+ Add product"** button
2. Fill in the product details:

### Required Fields:
- **Name**: e.g., "Zonta Logo Tote Bag"
- **Description**: e.g., "Durable canvas tote with Zonta Club of Naples logo"
- **Pricing**: 
  - Choose "Standard pricing"
  - Enter price (e.g., $24.99)
  - Currency: USD
  - Billing period: "One time"

### Optional but Recommended:
- **Images**: Upload product photo (click "Add images")
  - Recommended size: 800x800px or larger
  - Supports JPG, PNG, GIF
  - Up to 8 images per product

- **Additional Information**:
  - Product code/SKU
  - Statement descriptor (how it appears on bank statements)

3. Click **"Save product"**

## Step 3: Make Product Active

- Ensure the product is marked as **Active** (toggle in product details)
- Only active products will appear in your store

## Step 4: View in Your Store

Your store automatically fetches products from Stripe:
1. Restart your checkout server if it's running:
   ```bash
   cd server
   npm start
   ```

2. Refresh your store page
3. Products should now appear!

## Product Flow Hierarchy

Your store tries to fetch products in this order:
1. **Stripe** (via checkout server) ← *Now the primary source!*
2. **Strapi CMS** (if configured)
3. **Local fallback** (hardcoded products.js)

## Managing Products

### To Edit a Product:
1. Go to Stripe Dashboard > Products
2. Click on the product
3. Edit details and click "Save"

### To Remove a Product:
1. Go to product details
2. Toggle "Active" to OFF (or archive it)

### To Add Product Images:
1. Edit product
2. Click "Add images" 
3. Upload or paste image URL
4. Save

## Important Notes

- **Test vs Live Mode**: 
  - Use Test Mode for development
  - Switch to Live Mode for real transactions
  - Products are separate between modes

- **Pricing**: 
  - Stripe stores prices in cents (e.g., $24.99 = 2499 cents)
  - Your checkout server automatically converts to dollars

- **Images**: 
  - Must be publicly accessible URLs
  - Stripe hosts uploaded images automatically

## Example Products to Create

Here are some example products for your Zonta Club store:

### 1. Zonta Logo Tote Bag
- Price: $24.99
- Description: Durable canvas tote with Zonta Club of Naples logo

### 2. Zonta Coffee Mug
- Price: $12.00
- Description: Ceramic mug, dishwasher safe

### 3. Zonta T-Shirt
- Price: $18.50
- Description: Comfort fit t-shirt with front print

### 4. Zonta Pin
- Price: $6.00
- Description: Enamel lapel pin

### 5. General Donation
- Name: "Make a Donation"
- Price: $25.00 (or create multiple amounts: $10, $25, $50, $100)
- Description: Support the Zonta Club of Naples mission

## Testing

Use these test card numbers in Stripe Checkout:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- Any future expiry date (e.g., 12/25)
- Any 3-digit CVC

## Troubleshooting

**Products not showing?**
- Check that checkout server is running on port 4242
- Verify products are marked as "Active" in Stripe
- Check browser console for errors

**Images not displaying?**
- Ensure image URLs are publicly accessible
- Try uploading images directly to Stripe instead of using URLs

**Need to go back to local products?**
- Products will automatically fall back to local if Stripe connection fails
- Local products are in `src/data/products.js`
